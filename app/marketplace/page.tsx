'use client';

import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Agent type from backend API
interface Agent {
  id: number;
  name: string;
  category: string;
  pricePerCall: number;
  description?: string;
  createdAt: string;
  rating: number;
  totalCalls: number;
}

export default function Marketplace() {
  const { address, isConnected } = useAccount();
  const [showAddAgentModal, setShowAddAgentModal] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    endpointUrl: '',
    pricePerCall: '',
    category: '',
    description: '',
  });

  // Hardcoded agents for now (backend not working)
  React.useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const hardcodedAgents: Agent[] = [
        {
          id: 1,
          name: "DeFi Arbitrage Bot",
          category: "Finance",
          pricePerCall: 1, // 0.01 USDC in cents
          description: "Monitors cross-exchange pricing on Avalanche subnets and executes X402 flash swaps for profit.",
          createdAt: new Date().toISOString(),
          rating: 0,
          totalCalls: 0,
        },
        {
          id: 2,
          name: "Content Generator AI",
          category: "Content",
          pricePerCall: 1, // 0.01 USDC in cents
          description: "Creates concise, tokenized summaries of news articles for micro-reading platforms.",
          createdAt: new Date().toISOString(),
          rating: 0,
          totalCalls: 0,
        },
        {
          id: 3,
          name: "Smart Contract Auditor Agent",
          category: "Security",
          pricePerCall: 1, // 0.01 USDC in cents
          description: "AI-powered smart contract security analysis. Detects vulnerabilities, gas optimization opportunities, and compliance issues.",
          createdAt: new Date().toISOString(),
          rating: 0,
          totalCalls: 0,
        },
      ];
      setAgents(hardcodedAgents);
      setIsLoading(false);
      setError(null);
    }, 500);
  }, []);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  // Get unique categories from agents
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(agents.map(agent => agent.category));
    return ['All', ...Array.from(uniqueCategories).sort()];
  }, [agents]);

  const agentCategories = ['Development', 'Analytics', 'Content', 'Research', 'Media', 'Language', 'AI Tools', 'Trading', 'Finance', 'Utility', 'Logistics', 'Security'];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.description && agent.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !address) {
      toast.warning('Please connect your wallet first');
      return;
    }
    setIsSubmitting(true);
    try {
      // Convert price to cents (e.g., 0.01 USDC = 1 cent)
      const priceInCents = Math.round(parseFloat(formData.pricePerCall) * 100);
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          owner: address,
          endpointUrl: formData.endpointUrl,
          pricePerCall: priceInCents,
          category: formData.category,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register agent');
      }

      const result = await response.json();
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Refresh agents list
      const agentsResponse = await fetch('/api/agents');
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        setAgents(agentsData);
      }
      
      // Auto-close modal after 3 seconds
      setTimeout(() => {
        setShowAddAgentModal(false);
        setIsSuccess(false);
        setFormData({
          name: '',
          endpointUrl: '',
          pricePerCall: '',
          category: '',
          description: '',
        });
      }, 3000);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans tracking-tight relative overflow-x-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />


      {/* ADD AGENT BUTTON - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-10">
        <button
          onClick={() => {
            if (!isConnected) {
              toast.warning('Please connect your wallet first');
              return;
            }
            setShowAddAgentModal(true);
          }}
          className="bg-[#CC4420] border-2 border-white shadow-[6px_6px_0_0_rgba(255,255,255,1)] px-6 py-3 rounded-lg cursor-pointer hover:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
        >
          <span className="text-2xl font-black text-white">+ Add Agent</span>
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 pt-20 pb-20 px-4 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white mb-4">Agent Marketplace</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Discover and interact with AI agents (MCPs) deployed on Avalanche. Pay per use with x402 micropayments.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC4420] text-white placeholder:text-gray-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 border-2 border-white rounded-lg font-bold transition-all ${
                  selectedCategory === category
                    ? 'bg-[#CC4420] text-white shadow-[4px_4px_0_0_rgba(255,255,255,1)]'
                    : 'bg-black text-white hover:bg-gray-900 shadow-[2px_2px_0_0_rgba(255,255,255,1)]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-400">Loading agents...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <p className="text-lg text-red-500">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#CC4420] text-white border-2 border-white rounded-lg font-bold hover:bg-[#B85542]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Agents Grid */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAgents.map((agent) => {
                // Format price from cents to USDC
                const priceInUSDC = (agent.pricePerCall / 100).toFixed(2);
                // Format rating (from SC, 0 if no ratings yet)
                const rating = agent.rating > 0 ? agent.rating.toFixed(1) : '0.0';
                
                return (
                  <Link key={agent.id} href={`/marketplace/${agent.id}`}>
                    <div className="bg-black border-2 border-white shadow-[8px_8px_0_0_rgba(255,255,255,1)] rounded-2xl p-6 hover:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-white mb-2">{agent.name}</h3>
                          <span className="inline-block bg-[#CC4420] text-white text-xs font-bold px-2 py-1 rounded border border-white">
                            {agent.category}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {agent.description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-bold text-white">{rating}</span>
                          <span className="text-xs text-gray-500">({agent.totalCalls} calls)</span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-black text-[#CC4420]">{priceInUSDC} USDC</div>
                          <div className="text-xs text-gray-500">per call</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t-2 border-white">
                        <div className="text-xs text-gray-500 font-mono truncate">
                          Agent ID: {agent.id}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {filteredAgents.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-400">No agents found. Try a different search or category.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ADD AGENT MODAL */}
      {showAddAgentModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black border-2 border-white shadow-[12px_12px_0_0_rgba(255,255,255,1)] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black text-white">{isSuccess ? 'Success!' : 'Register New Agent'}</h2>
              {!isSuccess && (
                <button
                  onClick={() => {
                    setShowAddAgentModal(false);
                    setIsSuccess(false);
                    setFormData({
                      name: '',
                      endpointUrl: '',
                      pricePerCall: '',
                      category: '',
                      description: '',
                    });
                  }}
                  className="bg-black border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] px-4 py-2 rounded-lg hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-black text-white text-xl"
                >
                  ✕
                </button>
              )}
            </div>
            {isSuccess ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full border-4 border-white">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Agent Submitted!</h3>
                <p className="text-lg text-gray-400">Agent will be live in few seconds</p>
              </div>
            ) : (
              <>
                {!isConnected && (
                  <div className="mb-6 p-4 bg-yellow-900/50 border-2 border-yellow-400 rounded-lg">
                    <p className="text-sm text-white font-bold">Please connect your wallet in the navbar to register an agent</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Agent Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Code Assistant Agent"
                      className="w-full px-4 py-3 bg-[#0A0A0A] border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC4420] placeholder:text-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Helps with code generation, debugging, and code reviews..."
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC4420] placeholder:text-gray-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Agent Endpoint *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.endpointUrl}
                      onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
                      placeholder="https://api.example.com/mcp"
                      className="w-full px-4 py-3 bg-[#0A0A0A] border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC4420] placeholder:text-gray-500 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Price per Call (USDC) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={formData.pricePerCall}
                        onChange={(e) => setFormData({ ...formData, pricePerCall: e.target.value })}
                        placeholder="0.01"
                        className="w-full px-4 py-3 bg-[#0A0A0A] border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC4420] placeholder:text-gray-500 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CC4420] text-white"
                      >
                        <option value="" className="text-gray-500">Select category</option>
                        {agentCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {isConnected && address && (
                    <div className="p-4 bg-[#0A0A0A] border-2 border-white rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Owner Wallet</p>
                      <p className="text-sm font-mono text-white">{address}</p>
                    </div>
                  )}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddAgentModal(false)}
                      className="flex-1 bg-black border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] px-6 py-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!isConnected || isSubmitting}
                      className="flex-1 bg-[#CC4420] border-2 border-white shadow-[4px_4px_0_0_rgba(255,255,255,1)] px-6 py-3 rounded-lg hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Registering...' : 'Register Agent'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
