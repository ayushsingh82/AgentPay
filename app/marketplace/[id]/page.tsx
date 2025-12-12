'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, Send, Loader2 } from 'lucide-react';
import { createThirdwebClient } from 'thirdweb';
import { useActiveWallet, ConnectButton, ThirdwebProvider, useActiveAccount } from 'thirdweb/react';
import { wrapFetchWithPayment } from 'thirdweb/x402';
import { createNormalizedFetch } from '@/lib/payment';
import { AVALANCHE_FUJI_CHAIN_ID, USDC_FUJI_ADDRESS } from '@/lib/constants';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface Agent {
  agentId: number;
  name: string;
  description: string;
  category: string;
  pricePerCall: number;
  onChain: {
    averageRating: number;
    totalCalls: number;
    ratingCount: number;
  };
}

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const client = createThirdwebClient({
  clientId: clientId || "",
});

// Agent price is 0.01 USDC (10000 in smallest unit with 6 decimals)
const AGENT_PRICE = BigInt(10000); // $0.01 USDC (6 decimals)

// Local storage key for registered agents
const REGISTERED_AGENTS_KEY = 'registered_agents';

function AgentPageContent() {
  const params = useParams();
  const router = useRouter();
  const wallet = useActiveWallet();
  const account = useActiveAccount();
  const agentId = parseInt(params.id as string);
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoadingAgent, setIsLoadingAgent] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if agent is registered in local storage
  const isAgentRegistered = (): boolean => {
    if (typeof window === 'undefined') return false;
    const registered = localStorage.getItem(REGISTERED_AGENTS_KEY);
    if (!registered) return false;
    try {
      const agents = JSON.parse(registered);
      return Array.isArray(agents) && agents.includes(agentId);
    } catch {
      return false;
    }
  };

  // Mark agent as registered in local storage
  const markAgentAsRegistered = () => {
    if (typeof window === 'undefined') return;
    const registered = localStorage.getItem(REGISTERED_AGENTS_KEY);
    let agents: number[] = [];
    if (registered) {
      try {
        agents = JSON.parse(registered);
      } catch {
        agents = [];
      }
    }
    if (!agents.includes(agentId)) {
      agents.push(agentId);
      localStorage.setItem(REGISTERED_AGENTS_KEY, JSON.stringify(agents));
    }
  };

  // Hardcoded agents data (backend not working)
  useEffect(() => {
    setIsLoadingAgent(true);
    setTimeout(() => {
      const hardcodedAgents: Record<number, Agent> = {
        1: {
          agentId: 1,
          name: "DeFi Arbitrage Bot",
          description: "Monitors cross-exchange pricing on Avalanche subnets and executes X402 flash swaps for profit.",
          category: "Finance",
          pricePerCall: 1,
          onChain: {
            averageRating: 0,
            totalCalls: 0,
            ratingCount: 0,
          },
        },
        2: {
          agentId: 2,
          name: "Content Generator AI",
          description: "Creates concise, tokenized summaries of news articles for micro-reading platforms.",
          category: "Content",
          pricePerCall: 1,
          onChain: {
            averageRating: 0,
            totalCalls: 0,
            ratingCount: 0,
          },
        },
        3: {
          agentId: 3,
          name: "Smart Contract Auditor Agent",
          description: "AI-powered smart contract security analysis. Detects vulnerabilities, gas optimization opportunities, and compliance issues.",
          category: "Security",
          pricePerCall: 1,
          onChain: {
            averageRating: 0,
            totalCalls: 0,
            ratingCount: 0,
          },
        },
      };

      const agentData = hardcodedAgents[agentId];
      if (agentData) {
        setAgent(agentData);
      }
      setIsLoadingAgent(false);
    }, 300);
  }, [agentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoadingAgent) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#CC4420]" />
      </div>
    );
  }

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

  const handlePay = () => {
    if (!inputMessage.trim() || isLoading || isPaying) return;

    if (!wallet || !account) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: 'Please connect your wallet to interact with this agent.',
        sender: 'agent',
        timestamp: new Date(),
      }]);
      return;
    }

    // Show payment modal
    setPendingMessage(inputMessage);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    setShowPaymentModal(false);
    await handlePaymentWithMessage(pendingMessage);
  };

  const handlePaymentWithMessage = async (message: string) => {
    if (!wallet || !account) {
      setIsLoading(false);
      return;
    }

    setIsPaying(true);
    
    // Add user message first
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

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

      // Call the agent API with payment
      const apiUrl = `/api/agents/${agentId}/call`;
      const response = await fetchWithPay(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userAddress: account.address,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        // Mark agent as registered in local storage
        markAgentAsRegistered();
        
        const agentResponseText = data.response?.text || data.message || `Thank you for your query: "${message}". I'm processing your request.`;
        const successMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: agentResponseText,
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Agent Header - Name and Rating at Top */}
        <div className="bg-black border border-[#CC4420] rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-white">{agent.name}</h1>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 fill-[#CC4420] text-[#CC4420]" />
              <span className="text-xl font-semibold text-white">
                {agent.onChain?.averageRating ? agent.onChain.averageRating.toFixed(1) : '0.0'} / 5.0
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

        {/* Rating Section */}
        {wallet && messages.length > 0 && (
          <div className="bg-black border border-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-3">Rate this agent:</p>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  disabled={isLoading || isPaying}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || selectedRating)
                        ? 'fill-[#CC4420] text-[#CC4420]'
                        : 'fill-gray-700 text-gray-700'
                    } transition-colors`}
                  />
                </button>
              ))}
              {selectedRating > 0 && (
                <span className="ml-3 text-sm text-gray-400">
                  {selectedRating} {selectedRating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </div>
            {selectedRating > 0 && (
              <button
                onClick={async () => {
                  // Submit rating
                  try {
                    const response = await fetch(`/api/agents/${agentId}/rate`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        rating: selectedRating,
                        userAddress: account?.address,
                      }),
                    });
                    if (response.ok) {
                      setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        text: `Thank you for rating ${selectedRating} ${selectedRating === 1 ? 'star' : 'stars'}!`,
                        sender: 'agent',
                        timestamp: new Date(),
                      }]);
                      setSelectedRating(0);
                    }
                  } catch (error) {
                    console.error('Error submitting rating:', error);
                  }
                }}
                className="mt-3 px-4 py-2 bg-[#CC4420] text-white rounded-lg hover:bg-[#B85542] transition text-sm font-bold"
              >
                Submit Rating
              </button>
            )}
          </div>
        )}

        {/* Chat Interface */}
        <div className="bg-black border border-gray-700 rounded-lg flex flex-col h-[600px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  Type your query below and click "Pay" to interact with {agent.name}
                </p>
              </div>
            )}
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
                onKeyPress={(e) => e.key === 'Enter' && handlePay()}
                placeholder="Type your query here..."
                disabled={isLoading || isPaying || !wallet}
                className="flex-1 bg-[#0A0A0A] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:border-[#CC4420] disabled:opacity-50"
              />
              <button
                onClick={handlePay}
                disabled={isLoading || isPaying || !inputMessage.trim() || !wallet}
                className="px-6 py-2 bg-[#CC4420] text-white rounded-lg hover:bg-[#B85542] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-bold"
              >
                {isLoading || isPaying ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Pay</span>
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Price: 0.01 USDC per query • Click "Pay" to process your query
            </p>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-black border-2 border-white shadow-[12px_12px_0_0_rgba(255,255,255,1)] rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-white">Confirm Payment</h2>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPendingMessage('');
                }}
                className="bg-black border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] px-4 py-2 rounded-lg hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black text-white text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#0A0A0A] border-2 border-white rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Amount to Pay</p>
                <p className="text-3xl font-black text-[#CC4420]">0.01 USDC</p>
              </div>
              
              <div className="bg-[#0A0A0A] border-2 border-white rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Your Query</p>
                <p className="text-white">{pendingMessage}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPendingMessage('');
                  }}
                  className="flex-1 bg-black border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] px-6 py-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPayment}
                  disabled={isPaying}
                  className="flex-1 bg-[#CC4420] border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] px-6 py-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Pay 0.01 USDC</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

