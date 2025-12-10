import { NextResponse } from 'next/server';
import { registerAgentOnChain } from '@/lib/contract';
import { getAllAgents, addAgent } from '@/lib/agents-db';

// GET /api/agents - List all agents
export async function GET() {
  try {
    const agents = getAllAgents();
    return NextResponse.json(agents);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch agents', message: error.message },
      { status: 500 }
    );
  }
}

// POST /api/agents - Register a new agent
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, owner, endpointUrl, pricePerCall, category, description } = body;

    // Validation
    if (!name || !owner || !endpointUrl || !pricePerCall || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const secretKey = process.env.THIRDWEB_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: 'Server configuration error: THIRDWEB_SECRET_KEY not set' },
        { status: 500 }
      );
    }

    // Register agent on-chain
    let onChainAgentId: bigint;
    try {
      onChainAgentId = await registerAgentOnChain(secretKey, owner, name);
    } catch (contractError: any) {
      console.error('Contract registration error:', contractError);
      return NextResponse.json(
        { 
          error: 'Failed to register agent on-chain', 
          message: contractError.message || 'Contract interaction failed' 
        },
        { status: 500 }
      );
    }

    // Create new agent with on-chain ID
    // pricePerCall is already in cents from frontend (e.g., 0.01 USDC = 1 cent)
    // Frontend converts: 0.01 * 100 = 1, so we receive 1 (already in cents)
    const priceInCents = typeof pricePerCall === 'number' 
      ? Math.round(pricePerCall) 
      : Math.round(parseFloat(pricePerCall));

    const newAgent = {
      id: Number(onChainAgentId),
      name,
      owner,
      endpointUrl,
      pricePerCall: priceInCents, // Store in cents
      category,
      description: description || '',
      createdAt: new Date().toISOString(),
      rating: 0,
      totalCalls: 0,
      active: true,
    };

    addAgent(newAgent);

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to register agent', message: error.message },
      { status: 500 }
    );
  }
}
