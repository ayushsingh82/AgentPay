import { NextResponse } from 'next/server';
import { getAgentFromContract } from '@/lib/contract';

// Mock database - replace with your actual database
// This stores off-chain metadata (category, description, endpointUrl, etc.)
let agents: any[] = [
  {
    id: 1,
    name: "DeFi Arbitrage Bot",
    category: "Finance",
    pricePerCall: 100, // in cents (0.01 USDC)
    description: "Monitors cross-exchange pricing on Avalanche subnets and executes X402 flash swaps for profit.",
    createdAt: new Date().toISOString(),
    rating: 0,
    totalCalls: 0,
    owner: "0x0000000000000000000000000000000000000000",
    endpointUrl: "https://api.example.com/agent/1",
    active: true,
  },
];

// GET /api/agents/[id] - Get agent details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agentId = parseInt(id);

    // Find agent in local database (off-chain metadata)
    const agent = agents.find(a => a.id === agentId);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Fetch on-chain data from contract
    const secretKey = process.env.THIRDWEB_SECRET_KEY;
    let onChainData = null;

    if (secretKey) {
      try {
        onChainData = await getAgentFromContract(secretKey, BigInt(agentId));
      } catch (contractError) {
        console.error('Error fetching on-chain data:', contractError);
        // Continue with fallback data if contract call fails
      }
    }

    // Merge off-chain and on-chain data
    const agentResponse = {
      agentId: agent.id,
      owner: agent.owner,
      name: agent.name,
      endpointUrl: agent.endpointUrl,
      description: agent.description,
      category: agent.category,
      pricePerCall: agent.pricePerCall,
      active: agent.active,
      createdAt: agent.createdAt,
      onChain: onChainData || {
        totalCalls: agent.totalCalls || 0,
        ratingCount: 0,
        averageRating: agent.rating || 0,
        active: agent.active,
        earnings24h: 0,
        successRate: 100,
        successfulCalls: agent.totalCalls || 0,
        failedCalls: 0,
        totalEarnings: 0,
      },
    };

    return NextResponse.json(agentResponse);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch agent', message: error.message },
      { status: 500 }
    );
  }
}
