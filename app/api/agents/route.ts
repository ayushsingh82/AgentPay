import { NextResponse } from 'next/server';

// Mock database - replace with your actual database
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

    // Create new agent
    const newAgent = {
      id: agents.length + 1,
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
