import { createThirdwebClient, getContract } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { AGENT_BAZAAR_REGISTRY_ADDRESS } from "./constant";

// AgentBazaarRegistry ABI - Exact ABI from deployed contract
export const AGENT_BAZAAR_REGISTRY_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_coordinator",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			}
		],
		"name": "AgentRated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "AgentRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "newName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"name": "AgentUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"name": "CallRecorded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "payer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "PaymentReceived",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "rating",
				"type": "uint8"
			}
		],
		"name": "rateAgent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"name": "recordCall",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "payer",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "recordPayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "registerAgent",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "newName",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"name": "updateAgent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "agents",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalCalls",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalRating",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "ratingCount",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "totalEarnings",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "successfulCalls",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "failedCalls",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			}
		],
		"name": "averageRating",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "canRate",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "coordinator",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "earningsByDay",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			}
		],
		"name": "getEarnings24h",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "agentId",
				"type": "uint256"
			}
		],
		"name": "getSuccessRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextAgentId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
] as const;

/**
 * Get the contract instance
 */
export function getAgentBazaarRegistryContract(secretKey: string) {
  const client = createThirdwebClient({
    secretKey: secretKey,
  });

  return getContract({
    client,
    chain: avalancheFuji,
    address: AGENT_BAZAAR_REGISTRY_ADDRESS,
    abi: AGENT_BAZAAR_REGISTRY_ABI,
  });
}

/**
 * Register a new agent on-chain
 * Note: This requires the coordinator private key to be set in COORDINATOR_PRIVATE_KEY env var
 */
export async function registerAgentOnChain(
  secretKey: string,
  owner: string,
  name: string
): Promise<bigint> {
  const contract = getAgentBazaarRegistryContract(secretKey);
  const { readContract, prepareContractCall, sendTransaction } = await import("thirdweb");
  const { privateKeyToAccount } = await import("thirdweb/wallets");

  const coordinatorPrivateKey = process.env.COORDINATOR_PRIVATE_KEY;
  if (!coordinatorPrivateKey) {
    throw new Error("COORDINATOR_PRIVATE_KEY environment variable is not set");
  }

  // Get nextAgentId before registration to know what ID will be assigned
  const nextAgentIdBefore = await readContract({
    contract,
    method: "function nextAgentId() view returns (uint256)",
    params: [],
  });

  // Create wallet from coordinator private key
  const wallet = privateKeyToAccount({
    client: contract.client,
    privateKey: coordinatorPrivateKey as `0x${string}`,
  });

  const transaction = prepareContractCall({
    contract,
    method: "function registerAgent(address owner, string name) returns (uint256 agentId)",
    params: [owner as `0x${string}`, name],
  });

  const receipt = await sendTransaction({
    transaction,
    account: wallet,
  });

  // The agentId will be the nextAgentId before registration
  return nextAgentIdBefore;
}

/**
 * Get agent data from contract
 */
export async function getAgentFromContract(
  secretKey: string,
  agentId: bigint
) {
  const contract = getAgentBazaarRegistryContract(secretKey);
  const { readContract } = await import("thirdweb");

  try {
    const agent = await readContract({
      contract,
      method: "function agents(uint256) view returns (uint256 id, address owner, string name, uint256 totalCalls, uint256 totalRating, uint256 ratingCount, bool active, uint256 totalEarnings, uint256 successfulCalls, uint256 failedCalls)",
      params: [agentId],
    });

    let averageRating = 0n;
    let earnings24h = 0n;
    let successRate = 0n;

    try {
      averageRating = await readContract({
        contract,
        method: "function averageRating(uint256) view returns (uint256)",
        params: [agentId],
      });
    } catch (e) {
      // If agent has no ratings, averageRating will fail
      console.log("No ratings yet for agent");
    }

    try {
      earnings24h = await readContract({
        contract,
        method: "function getEarnings24h(uint256) view returns (uint256)",
        params: [agentId],
      });
    } catch (e) {
      console.log("Error fetching 24h earnings");
    }

    try {
      successRate = await readContract({
        contract,
        method: "function getSuccessRate(uint256) view returns (uint256)",
        params: [agentId],
      });
    } catch (e) {
      console.log("Error fetching success rate");
    }

    return {
      id: Number(agent.id),
      owner: agent.owner,
      name: agent.name,
      totalCalls: Number(agent.totalCalls),
      totalRating: Number(agent.totalRating),
      ratingCount: Number(agent.ratingCount),
      active: agent.active,
      totalEarnings: Number(agent.totalEarnings),
      successfulCalls: Number(agent.successfulCalls),
      failedCalls: Number(agent.failedCalls),
      averageRating: agent.ratingCount > 0 ? Number(averageRating) / 1e18 : 0, // Convert from scaled value
      earnings24h: Number(earnings24h),
      successRate: agent.totalCalls > 0 ? Number(successRate) / 100 : 0, // Convert from percentage (e.g., 9850 -> 98.5)
    };
  } catch (error) {
    console.error("Error fetching agent from contract:", error);
    return null;
  }
}

/**
 * Record a call on-chain
 * Note: This requires the coordinator private key to be set in COORDINATOR_PRIVATE_KEY env var
 */
export async function recordCallOnChain(
  secretKey: string,
  agentId: bigint,
  user: string,
  success: boolean
) {
  const contract = getAgentBazaarRegistryContract(secretKey);
  const { prepareContractCall, sendTransaction } = await import("thirdweb");
  const { privateKeyToAccount } = await import("thirdweb/wallets");

  const coordinatorPrivateKey = process.env.COORDINATOR_PRIVATE_KEY;
  if (!coordinatorPrivateKey) {
    throw new Error("COORDINATOR_PRIVATE_KEY environment variable is not set");
  }

  const wallet = privateKeyToAccount({
    client: contract.client,
    privateKey: coordinatorPrivateKey as `0x${string}`,
  });

  const transaction = prepareContractCall({
    contract,
    method: "function recordCall(uint256 agentId, address user, bool success)",
    params: [agentId, user as `0x${string}`, success],
  });

  const receipt = await sendTransaction({
    transaction,
    account: wallet,
  });

  return receipt;
}

/**
 * Record a payment on-chain
 * Note: This requires the coordinator private key to be set in COORDINATOR_PRIVATE_KEY env var
 */
export async function recordPaymentOnChain(
  secretKey: string,
  agentId: bigint,
  payer: string,
  amount: bigint
) {
  const contract = getAgentBazaarRegistryContract(secretKey);
  const { prepareContractCall, sendTransaction } = await import("thirdweb");
  const { privateKeyToAccount } = await import("thirdweb/wallets");

  const coordinatorPrivateKey = process.env.COORDINATOR_PRIVATE_KEY;
  if (!coordinatorPrivateKey) {
    throw new Error("COORDINATOR_PRIVATE_KEY environment variable is not set");
  }

  const wallet = privateKeyToAccount({
    client: contract.client,
    privateKey: coordinatorPrivateKey as `0x${string}`,
  });

  const transaction = prepareContractCall({
    contract,
    method: "function recordPayment(uint256 agentId, address payer, uint256 amount)",
    params: [agentId, payer as `0x${string}`, amount],
  });

  const receipt = await sendTransaction({
    transaction,
    account: wallet,
  });

  return receipt;
}

/**
 * Check if user can rate an agent
 */
export async function canUserRate(
  secretKey: string,
  user: string,
  agentId: bigint
): Promise<boolean> {
  const contract = getAgentBazaarRegistryContract(secretKey);
  const { readContract } = await import("thirdweb");

  try {
    const canRate = await readContract({
      contract,
      method: "function canRate(address user, uint256 agentId) view returns (bool)",
      params: [user as `0x${string}`, agentId],
    });

    return canRate;
  } catch (error) {
    console.error("Error checking if user can rate:", error);
    return false;
  }
}
