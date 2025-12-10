import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { USDC_FUJI_ADDRESS } from "../../../../../../lib/constant";
import { NextResponse } from 'next/server';

// Mock database
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

// POST /api/agents/[id]/call - Call agent with payment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const paymentData = request.headers.get("x-payment") || request.headers.get("X-PAYMENT");
  const { id: agentId } = await params;
  const body = await request.json();
  const { message, userAddress } = body;

  // Find agent
  const agent = agents.find(a => a.id === parseInt(agentId));
  if (!agent) {
    return NextResponse.json(
      { error: 'Agent not found' },
      { status: 404 }
    );
  }

  // Initialize client and facilitator
  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const serverWalletAddress = process.env.THIRDWEB_SERVER_WALLET_ADDRESS;
  const merchantWalletAddress = process.env.MERCHANT_WALLET_ADDRESS;

  if (!secretKey || !serverWalletAddress || !merchantWalletAddress) {
    return NextResponse.json(
      {
        error: "Server configuration error",
        message: "Payment service is not properly configured",
      },
      { status: 500 }
    );
  }

  const client = createThirdwebClient({
    secretKey: secretKey,
  });

  const thirdwebFacilitator = facilitator({
    client,
    serverWalletAddress: serverWalletAddress,
  });

  try {
    // Convert price to string (in smallest unit, 6 decimals for USDC)
    const priceInSmallestUnit = (agent.pricePerCall).toString();

    const result = await settlePayment({
      resourceUrl: `/api/agents/${agentId}/call`,
      method: "POST",
      paymentData,
      payTo: merchantWalletAddress,
      network: avalancheFuji,
      price: {
        amount: priceInSmallestUnit,
        asset: {
          address: USDC_FUJI_ADDRESS,
        },
      },
      facilitator: thirdwebFacilitator,
    });

    if (result.status === 200) {
      // Payment successful - call the agent endpoint
      try {
        // Update call count
        agent.totalCalls = (agent.totalCalls || 0) + 1;

        // In a real implementation, you would call the agent's endpointUrl here
        // For now, return a mock response
        const agentResponse = {
          response: {
            text: `Thank you for your message: "${message}". I'm ${agent.name} and I'm processing your request. This is a mock response - in production, this would call the agent at ${agent.endpointUrl}.`,
          },
        };

        return NextResponse.json(agentResponse);
      } catch (agentError: any) {
        console.error('Agent call error:', agentError);
        return NextResponse.json(
          {
            error: 'Agent call failed',
            message: agentError.message,
          },
          { status: 500 }
        );
      }
    } else {
      // Return payment requirements (402 Payment Required)
      return NextResponse.json(
        result.responseBody || {
          error: "Payment required",
          message: "Payment is required to call this agent",
          accepts: [{
            type: "application/x402-payment",
            version: 1,
            network: "avalanche-fuji",
            asset: {
              address: USDC_FUJI_ADDRESS,
            },
            amount: priceInSmallestUnit,
          }],
        },
        {
          status: result.status || 402,
          headers: result.responseHeaders || {},
        }
      );
    }
  } catch (error) {
    console.error("Payment settlement error:", error);
    return NextResponse.json(
      {
        error: "Payment processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
