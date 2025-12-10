import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient } from "thirdweb";
import { avalancheFuji } from "thirdweb/chains";
import { USDC_FUJI_ADDRESS, PAYMENT_AMOUNTS, API_ENDPOINTS } from "../../../lib/constant";

export async function GET(request: Request) {
  const paymentData = request.headers.get("x-payment") || request.headers.get("X-PAYMENT");

  // Initialize client and facilitator at runtime, not build time
  const secretKey = process.env.THIRDWEB_SECRET_KEY;
  const serverWalletAddress = process.env.THIRDWEB_SERVER_WALLET_ADDRESS;
  const merchantWalletAddress = process.env.MERCHANT_WALLET_ADDRESS;

  if (!secretKey || !serverWalletAddress || !merchantWalletAddress) {
    return Response.json(
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
    const result = await settlePayment({
      resourceUrl: API_ENDPOINTS.PREMIUM,
      method: "GET",
      paymentData,
      payTo: merchantWalletAddress,
      network: avalancheFuji,
      price: {
        amount: PAYMENT_AMOUNTS.PREMIUM.amount,
        asset: {
          address: USDC_FUJI_ADDRESS,
        },
      },
      facilitator: thirdwebFacilitator,
    });

    if (result.status === 200) {
      return Response.json({
        tier: "premium",
        data: "Welcome to Premium tier! You have unlocked all advanced features.",
        timestamp: new Date().toISOString(),
      });
    } else {
      return Response.json(result.responseBody || {
        error: "Payment required",
        message: "Payment is required to access this resource",
      }, {
        status: result.status,
        headers: result.responseHeaders,
      });
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