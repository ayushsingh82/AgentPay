import { NextResponse } from 'next/server';

// GET /api/config - Get contract address and configuration
export async function GET() {
  try {
    // Get contract address from environment variable
    // You should set this in your .env.local file
    const contractAddress = process.env.NEXT_PUBLIC_REPUTATION_CONTRACT_ADDRESS || '';

    return NextResponse.json({
      contractAddress,
      network: 'avalanche-fuji',
      chainId: 43113,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch config', message: error.message },
      { status: 500 }
    );
  }
}
