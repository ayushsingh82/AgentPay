import { NextResponse } from 'next/server';
import { AGENT_BAZAAR_REGISTRY_ADDRESS } from '@/lib/constant';

// GET /api/config - Get contract address and configuration
export async function GET() {
  try {
    return NextResponse.json({
      contractAddress: AGENT_BAZAAR_REGISTRY_ADDRESS,
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
