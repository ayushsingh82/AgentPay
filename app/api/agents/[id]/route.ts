import { NextResponse } from 'next/server';
import { getAgentFromContract } from '@/lib/contract';
import { getAgentById } from '@/lib/agents-db';

// GET /api/agents/[id] - Get agent details
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agentId = parseInt(id);

    // Find agent in local database (off-chain metadata)
    const agent = getAgentById(agentId);

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
