'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Send, Loader2 } from 'lucide-react';
import { createThirdwebClient } from 'thirdweb';
import { useActiveWallet, ConnectButton, ThirdwebProvider } from 'thirdweb/react';
import { wrapFetchWithPayment } from 'thirdweb/x402';
import { createNormalizedFetch } from '@/lib/payment';
import { AVALANCHE_FUJI_CHAIN_ID, USDC_FUJI_ADDRESS } from '@/lib/constants';

// Mock agents data (should match marketplace page)
const mockAgents = [
  { id: 1, name: "DeFi Arbitrage Bot", description: "Monitors cross-exchange pricing on Avalanche subnets and executes X402 flash swaps for profit.", category: "Finance", reputation: 4.8, priceAvax: 0.05, calls: 12450 },
  { id: 2, name: "Content Generator AI", description: "Creates concise, tokenized summaries of news articles for micro-reading platforms.", category: "Content", reputation: 4.5, priceAvax: 0.01, calls: 9876 },
  { id: 3, name: "Identity Validator Agent", description: "Verifies user's on-chain reputation before granting access to premium services.", category: "Utility", reputation: 4.9, priceAvax: 0.02, calls: 3500 },
  { id: 4, name: "Supply Chain Tracker", description: "Logs sensor data onto a private subnet, triggered by X402 delivery confirmations.", category: "Logistics", reputation: 4.2, priceAvax: 0.03, calls: 5120 },
  { id: 5, name: "Smart Contract Auditor Agent", description: "AI-powered smart contract security analysis. Detects vulnerabilities, gas optimization opportunities, and compliance issues in Solidity contracts.", category: "Security", reputation: 4.9, priceAvax: 0.08, calls: 2340 },
];

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const client = createThirdwebClient({
  clientId: clientId || "",
});

// Agent price is 0.01 USDC for all agents
const AGENT_PRICE = BigInt(10000); // $0.01 USDC (6 decimals)

function AgentPageContent() {
  const params = useParams();
  const router = useRouter();
  const wallet = useActiveWallet();
  const agentId = parseInt(params.id as string);
  const agent = mockAgents.find(a => a.id === agentId);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm ${agent?.name || 'an agent'}. How can I help you today?`,
      sender: 'agent',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Agent not found</h1>
          <button
            onClick={() => router.push('/marketplace')}
            className="px-6 py-2 bg-[#CC4420] text-white rounded-lg hover:bg-[#B85542] transition"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const checkPaymentPrompt = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return lowerText.includes('pay') || 
           lowerText.includes('payment') || 
           lowerText.includes('purchase') ||
           lowerText.includes('buy') ||
           lowerText.includes('access');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Check if user is asking for payment
    if (checkPaymentPrompt(inputMessage)) {
      if (!wallet) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: 'Please connect your wallet to proceed with payment.',
          sender: 'agent',
          timestamp: new Date(),
        }]);
        setIsLoading(false);
        return;
      }

      // Trigger payment
      await handlePayment();
      setIsLoading(false);
      return;
    }

    // Simulate agent response (in real app, this would call the agent API)
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thank you for your message. I'm processing your request. If you need to access my services, please type "pay" or "payment" to proceed.`,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handlePayment = async () => {
    if (!wallet) return;

    setIsPaying(true);
    const paymentMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Processing payment of 0.01 USDC...',
      sender: 'agent',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, paymentMessage]);

    try {
      const normalizedFetch = createNormalizedFetch(AVALANCHE_FUJI_CHAIN_ID);
      const fetchWithPay = wrapFetchWithPayment(
        normalizedFetch,
        client,
        wallet,
        {
          maxValue: AGENT_PRICE,
        }
      );

      const apiUrl = `/api/agent/${agentId}`;
      const response = await fetchWithPay(apiUrl);

      if (response.status === 200) {
        const data = await response.json();
        const successMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: `Payment successful! ${data.message || 'You now have access to this agent.'}`,
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, successMessage]);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: `Payment failed: ${errorData.error || errorData.message || 'Please try again.'}`,
          sender: 'agent',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `Error: ${error instanceof Error ? error.message : 'Payment processing failed'}`,
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Agent Header */}
        <div className="bg-black border border-[#CC4420] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">{agent.name}</h1>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-[#CC4420] text-[#CC4420]" />
              <span className="text-xl font-semibold text-white">
                {agent.reputation.toFixed(1)} / 5.0
              </span>
            </div>
          </div>
          <p className="text-zinc-400">{agent.description}</p>
          {!wallet && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-sm text-zinc-400 mb-2">Connect wallet to interact with this agent</p>
              <ConnectButton client={client} />
            </div>
          )}
        </div>

        {/* Chat Interface */}
        <div className="bg-black border border-gray-700 rounded-lg flex flex-col h-[600px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-[#CC4420] text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg px-4 py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#CC4420]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message... (type 'pay' to make payment)"
                disabled={isLoading || isPaying || !wallet}
                className="flex-1 bg-[#0A0A0A] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-[#CC4420] disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || isPaying || !inputMessage.trim() || !wallet}
                className="px-6 py-2 bg-[#CC4420] text-white rounded-lg hover:bg-[#B85542] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading || isPaying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Price: 0.01 USDC per interaction • Type "pay" or "payment" to access agent services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentPage() {
  return (
    <ThirdwebProvider>
      <AgentPageContent />
    </ThirdwebProvider>
  );
}
