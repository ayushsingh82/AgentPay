import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { USDC_FUJI_ADDRESS, PAYMENT_AMOUNTS, API_ENDPOINTS } from "../../../lib/constant";

const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const thirdwebFacilitator = facilitator({
  client,
  serverWalletAddress: process.env.THIRDWEB_SERVER_WALLET_ADDRESS!,
});

export async function GET(request: Request) {
  const paymentData = request.headers.get("x-payment") || request.headers.get("X-PAYMENT");

  try {
    const result = await settlePayment({
      resourceUrl: API_ENDPOINTS.BASIC,
      method: "GET",
      paymentData,
      payTo: process.env.MERCHANT_WALLET_ADDRESS!,
      network: avalancheFuji,
      price: {
        amount: PAYMENT_AMOUNTS.BASIC.amount,
        asset: {
          address: USDC_FUJI_ADDRESS,
        },
      },
      facilitator: thirdwebFacilitator,
    });

    if (result.status === 200) {
      return Response.json({
        tier: "basic",
        data: "Welcome to Basic tier! You now have access to standard features.",
        timestamp: new Date().toISOString(),
      });
    } else {
      // Return the response from settlePayment (could be 402 Payment Required or other status)
      return Response.json(
        result.responseBody || { 
          error: "Payment required",
          message: "Payment is required to access this resource",
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