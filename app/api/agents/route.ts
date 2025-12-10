import { NextResponse } from 'next/server';
import { registerAgentOnChain } from '@/lib/contract';

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

// GET /api/agents - List all agents
export async function GET() {
  try {
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
    const newAgent = {
      id: Number(onChainAgentId),
      name,
      owner,
      endpointUrl,
      pricePerCall: Math.round(parseFloat(pricePerCall) * 100), // Convert to cents
      category,
      description: description || '',
      createdAt: new Date().toISOString(),
      rating: 0,
      totalCalls: 0,
      active: true,
    };

    agents.push(newAgent);

    return NextResponse.json(newAgent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to register agent', message: error.message },
      { status: 500 }
    );
  }
}
