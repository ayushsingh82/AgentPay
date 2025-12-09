// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentBazaarRegistry
 * @dev On-chain registry + rating system for MCP Agents in Agent Bazaar marketplace.
 *      Payments + MCP metadata + endpoints are handled off-chain (x402 + DB).
 *      Smart contract only stores identity, calls, and ratings for trust.
 */

contract AgentBazaarRegistry {

    // ---------------------------------------------------------------------
    // DATA STRUCTURES
    // ---------------------------------------------------------------------

    struct Agent {
        uint256 id;
        address owner;          // Agent creator
        string name;            // Agent display name
        uint256 totalCalls;     // Number of calls (recorded by coordinator)
        uint256 totalRating;    // Sum of all ratings received
        uint256 ratingCount;    // Number of ratings
        bool active;            // Listing state
        uint256 totalEarnings;  // Total USDC earned
        uint256 successfulCalls; // Number of successful calls
        uint256 failedCalls;    // Number of failed calls
    }

    // ---------------------------------------------------------------------
    // STATE
    // ---------------------------------------------------------------------

    uint256 public nextAgentId = 1;

    address public coordinator;         // Agent Bazaar backend
    mapping(uint256 => Agent) public agents;
    mapping(address => mapping(uint256 => bool)) public canRate; 
    // user => agentId => true (after coordinator records a call)
    mapping(uint256 => mapping(uint256 => uint256)) public earningsByDay; 
    // agentId => day => earnings (for 24h stats)

    // ---------------------------------------------------------------------
    // EVENTS
    // ---------------------------------------------------------------------

    event AgentRegistered(uint256 indexed agentId, address indexed owner, string name);
    event AgentUpdated(uint256 indexed agentId, string newName, bool active);
    event CallRecorded(uint256 indexed agentId, address indexed user, bool success);
    event AgentRated(uint256 indexed agentId, address indexed user, uint8 rating);
    event PaymentReceived(uint256 indexed agentId, address indexed payer, uint256 amount, uint256 timestamp);

    // ---------------------------------------------------------------------
    // MODIFIERS
    // ---------------------------------------------------------------------

    modifier onlyCoordinator() {
        require(msg.sender == coordinator, "Not coordinator");
        _;
    }

    constructor(address _coordinator) {
        coordinator = _coordinator;
    }

    // ---------------------------------------------------------------------
    // CORE FUNCTIONS
    // ---------------------------------------------------------------------

    /**
     * @dev Register agent. MCP metadata is stored in DB, not on-chain.
     */
    function registerAgent(
        address owner,
        string calldata name
    ) external onlyCoordinator returns (uint256 agentId) {

        agentId = nextAgentId++;
        
        agents[agentId] = Agent({
            id: agentId,
            owner: owner,
            name: name,
            totalCalls: 0,
            totalRating: 0,
            ratingCount: 0,
            active: true,
            totalEarnings: 0,
            successfulCalls: 0,
            failedCalls: 0
        });

        emit AgentRegistered(agentId, owner, name);
    }

    /**
     * @dev Update agent metadata (name, active state).
     */
    function updateAgent(
        uint256 agentId,
        string calldata newName,
        bool active
    ) external onlyCoordinator {

        Agent storage a = agents[agentId];
        require(a.id != 0, "Invalid agent");

        a.name = newName;
        a.active = active;

        emit AgentUpdated(agentId, newName, active);
    }

    /**
     * @dev Record an agent call (successful or failed).
     *      Called after x402 payment succeeds.
     */
    function recordCall(
        uint256 agentId,
        address user,
        bool success
    ) external onlyCoordinator {

        Agent storage a = agents[agentId];
        require(a.id != 0, "Invalid agent");
        require(a.active, "Agent inactive");

        if (success) {
            a.successfulCalls += 1;
        } else {
            a.failedCalls += 1;
        }

        a.totalCalls += 1;

        // User is now allowed to rate this agent
        canRate[user][agentId] = true;

        emit CallRecorded(agentId, user, success);
    }

    /**
     * @dev Record a payment received for an agent.
     *      Called by coordinator after x402 payment succeeds.
     */
    function recordPayment(
        uint256 agentId,
        address payer,
        uint256 amount
    ) external onlyCoordinator {

        Agent storage a = agents[agentId];
        require(a.id != 0, "Invalid agent");

        a.totalEarnings += amount;
        
        // Track by day for 24h stats
        uint256 day = block.timestamp / 86400; // Days since epoch
        earningsByDay[agentId][day] += amount;
        
        emit PaymentReceived(agentId, payer, amount, block.timestamp);
    }

    /**
     * @dev Submit a rating (1–5) for an agent.
     */
    function rateAgent(
        uint256 agentId,
        uint8 rating
    ) external {

        require(rating >= 1 && rating <= 5, "Invalid rating");
        require(canRate[msg.sender][agentId], "Not eligible to rate");

        Agent storage a = agents[agentId];

        a.totalRating += rating;
        a.ratingCount += 1;

        // One rating per call
        canRate[msg.sender][agentId] = false;

        emit AgentRated(agentId, msg.sender, rating);
    }

    // ---------------------------------------------------------------------
    // VIEW HELPERS
    // ---------------------------------------------------------------------

    function averageRating(uint256 agentId) external view returns (uint256) {
        Agent storage a = agents[agentId];
        if (a.ratingCount == 0) return 0;
        return (a.totalRating * 1e18) / a.ratingCount; // scaled for precision
    }

    /**
     * @dev Get earnings for the last 24 hours.
     */
    function getEarnings24h(uint256 agentId) external view returns (uint256) {
        Agent storage a = agents[agentId];
        require(a.id != 0, "Invalid agent");
        
        uint256 today = block.timestamp / 86400;
        uint256 yesterday = today - 1;
        return earningsByDay[agentId][today] + earningsByDay[agentId][yesterday];
    }

    /**
     * @dev Get success rate as a percentage (scaled by 10000 for precision).
     *      Example: 98.5% = 9850
     */
    function getSuccessRate(uint256 agentId) external view returns (uint256) {
        Agent storage a = agents[agentId];
        require(a.id != 0, "Invalid agent");
        
        if (a.totalCalls == 0) return 0;
        return (a.successfulCalls * 10000) / a.totalCalls; // Scaled by 10000 for precision
    }
}