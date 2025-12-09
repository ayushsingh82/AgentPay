import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { USDC_FUJI_ADDRESS } from "../../../../lib/constant";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const thirdwebFacilitator = facilitator({
  client,
  serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET_ADDRESS!,
});

// Agent price is 0.01 USDC for all agents
const AGENT_PRICE = "10000"; // $0.01 USDC (6 decimals)

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const paymentData = request.headers.get("x-payment") || request.headers.get("X-PAYMENT");
  const agentId = params.id;

  try {
    const result = await settlePayment({
      resourceUrl: `/api/agent/${agentId}`,
      method: "GET",
      paymentData,
      payTo: process.env.MERCHANT_WALLET_ADDRESS!,
      network: avalancheFuji,
      price: {
        amount: AGENT_PRICE,
        asset: {
          address: USDC_FUJI_ADDRESS,
        },
      },
      facilitator: thirdwebFacilitator,
    });

    if (result.status === 200) {
      return Response.json({
        success: true,
        message: `Payment successful! You now have access to agent ${agentId}.`,
        agentId: agentId,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Return the response from settlePayment (could be 402 Payment Required or other status)
      return Response.json(
        result.responseBody || { 
          error: "Payment required",
          message: "Payment is required to access this agent",
        },
        {
          status: result.status,
          headers: result.responseHeaders,
        }
      );
    }
  } catch (error) {
    console.error("Payment settlement error:", error);
    return Response.json(
      {
        error: "Payment processing failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
