"use client";

import { useState, useEffect } from "react";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveWallet, useActiveAccount } from "thirdweb/react";
import { wrapFetchWithPayment } from "thirdweb/x402";
import { PaymentCard } from "@/components/payment-card";
import { ContentDisplay } from "@/components/content-display";
import { TransactionLog, LogEntry } from "@/components/transaction-log";
import { Separator } from "@/components/ui/separator";
import { createNormalizedFetch } from "@/lib/payment";
import { AVALANCHE_FUJI_CHAIN_ID, PAYMENT_AMOUNTS, API_ENDPOINTS } from "@/lib/constants";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

interface ContentData {
  tier: string;
  data: string;
  features?: string[];
  timestamp: string;
}

export default function TryPage() {
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const [content, setContent] = useState<ContentData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    setLogs([]);
    setContent(null);
  }, [wallet, account?.address]);

  const addLog = (message: string, type: LogEntry["type"]) => {
    setLogs((prev) => [...prev, { message, type, timestamp: new Date() }]);
  };

  const updateLogStatus = (messagePattern: string, newType: LogEntry["type"]) => {
    setLogs((prev) =>
      prev.map((log) =>
        log.message.includes(messagePattern) ? { ...log, type: newType } : log
      )
    );
  };

  const handlePayment = async (tier: "basic" | "premium") => {
    if (!wallet) return;

    setIsPaying(true);
    setContent(null);
    setLogs([]);

    try {
      addLog(`Initiating ${tier} payment...`, "info");
      const normalizedFetch = createNormalizedFetch(AVALANCHE_FUJI_CHAIN_ID);
      const fetchWithPay = wrapFetchWithPayment(
        normalizedFetch,
        client,
        wallet,
        tier === "basic" ? PAYMENT_AMOUNTS.BASIC.bigInt : PAYMENT_AMOUNTS.PREMIUM.bigInt
      );

      addLog("Requesting payment authorization...", "info");
      const response = await fetchWithPay(tier === "basic" ? API_ENDPOINTS.BASIC : API_ENDPOINTS.PREMIUM);
      const responseData = await response.json();

      if (response.status === 200) {
        updateLogStatus("Initiating", "success");
        updateLogStatus("Requesting payment authorization", "success");
        addLog("Payment successful!", "success");
        addLog("Content received", "success");
        setContent(responseData);
      } else {
        updateLogStatus("Initiating", "error");
        updateLogStatus("Requesting payment authorization", "error");
        const errorMsg = responseData.error || "Unknown error";
        addLog(`Payment failed: ${errorMsg}`, "error");
      }
    } catch (error) {
      updateLogStatus("Initiating", "error");
      updateLogStatus("Requesting payment authorization", "error");
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      addLog(`Error: ${errorMsg}`, "error");
    } finally {
      setIsPaying(false);
    }
  };

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-gray-100 relative overflow-hidden">
        {/* Orange gradient on left end */}
        <div className="absolute left-0 top-0 w-96 h-full bg-gradient-to-r from-[#CC4420]/50 to-transparent pointer-events-none"></div>
        {/* Orange gradient on right end */}
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#CC4420]/50 to-transparent pointer-events-none"></div>
        
        <div className="text-center space-y-6 p-8 z-10 relative">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-white">x402 Starter Kit</h1>
            <p className="text-zinc-400">HTTP 402 Payment Protocol Demo</p>
            <p className="text-sm text-zinc-500 mt-1">Avalanche Fuji Testnet</p>
          </div>
          <ConnectButton client={client} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 p-8 relative overflow-hidden">
      {/* Orange gradient on left end */}
      <div className="absolute left-0 top-0 w-96 h-full bg-gradient-to-r from-[#CC4420]/50 to-transparent pointer-events-none"></div>
      {/* Orange gradient on right end */}
      <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#CC4420]/50 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto space-y-8 z-10 relative">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">x402 Payment Demo</h1>
          <p className="text-zinc-400">Choose a payment tier to unlock content</p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <ConnectButton client={client} />
          </div>
        </div>

        <Separator />

        <div className="flex flex-wrap justify-between gap-6 max-w-4xl mx-auto">
          <PaymentCard
            tier="Basic"
            price="$0.01"
            description="Perfect for trying out the payment system"
            onPayClick={() => handlePayment("basic")}
            isPaying={isPaying}
          />

          <PaymentCard
            tier="Premium"
            price="$0.15"
            description="Full access to all advanced features"
            onPayClick={() => handlePayment("premium")}
            isPaying={isPaying}
          />
        </div>

        {content && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ContentDisplay
              tier={content.tier}
              data={content.data}
              features={content.features}
              timestamp={content.timestamp}
            />
          </div>
        )}

        {logs.length > 0 && (
          <div className="max-w-4xl mx-auto animate-in fade-in-from-bottom-4 duration-700">
            <TransactionLog logs={logs} />
          </div>
        )}
      </div>
    </div>
  );
}

