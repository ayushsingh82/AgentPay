import { NextResponse } from 'next/server';
import { createThirdwebClient, getContract, readContract } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { AGENT_BAZAAR_REGISTRY_ADDRESS } from "@/lib/constants";
import { AGENT_BAZAAR_REGISTRY_ABI } from "@/lib/contract";

// POST /api/agents/[id]/rate - Rate an agent
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const body = await request.json();
    const { rating, userAddress } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
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

    const client = createThirdwebClient({
      secretKey: secretKey,
    });

    const contract = getContract({
      client,
      chain: avalancheFuji,
      address: AGENT_BAZAAR_REGISTRY_ADDRESS,
      abi: AGENT_BAZAAR_REGISTRY_ABI,
    });

    // Check if user can rate this agent
    const canRate = await readContract({
      contract,
      method: "canRate",
      params: [userAddress as `0x${string}`, BigInt(parseInt(agentId))],
    });

    if (!canRate) {
      return NextResponse.json(
        { error: 'You are not eligible to rate this agent. You must call the agent first.' },
        { status: 403 }
      );
    }

    // Rating should be done directly by the user from their wallet
    // This endpoint just validates eligibility
    // The actual rating transaction should be submitted client-side
    
    return NextResponse.json({
      message: 'You are eligible to rate this agent',
      agentId: parseInt(agentId),
      rating,
      userAddress,
      contractAddress: AGENT_BAZAAR_REGISTRY_ADDRESS,
      note: 'Please submit the rating transaction directly from your wallet using the rateAgent function',
    });

  } catch (error: any) {
    console.error('Rating error:', error);
    return NextResponse.json(
      { error: 'Failed to process rating', message: error.message },
      { status: 500 }
    );
  }
}

// GET /api/agents/[id]/rate - Check if user can rate an agent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const { searchParams } = new URL(request.url);
    const userAddress = searchParams.get('userAddress');

    if (!userAddress) {
      return NextResponse.json(
        { error: 'User address is required' },
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

    const client = createThirdwebClient({
      secretKey: secretKey,
    });

    const contract = getContract({
      client,
      chain: avalancheFuji,
      address: AGENT_BAZAAR_REGISTRY_ADDRESS,
      abi: AGENT_BAZAAR_REGISTRY_ABI,
    });

    const canRate = await readContract({
      contract,
      method: "canRate",
      params: [userAddress as `0x${string}`, BigInt(parseInt(agentId))],
    });

    return NextResponse.json({
      canRate,
      agentId: parseInt(agentId),
      userAddress,
    });

  } catch (error: any) {
    console.error('Error checking rating eligibility:', error);
    return NextResponse.json(
      { error: 'Failed to check rating eligibility', message: error.message },
      { status: 500 }
    );
  }
}
