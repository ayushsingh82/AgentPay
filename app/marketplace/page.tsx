'use client';

import React, { useState, useMemo } from 'react';
import AgentCard from '@/app/components/AgentCard';
import { SlidersHorizontal, Search, X } from 'lucide-react';

// TypeScript interface for the Agent data
interface Agent {
  id: number;
  name: string;
  description: string;
  category: string;
  reputation: number;
  priceAvax: number;
  calls: number;
}

// Mock Data (Replace with your API fetch logic)
const mockAgents: Agent[] = [
  { id: 1, name: "DeFi Arbitrage Bot", description: "Monitors cross-exchange pricing on Avalanche subnets and executes X402 flash swaps for profit.", category: "Finance", reputation: 4.8, priceAvax: 0.05, calls: 12450 },
  { id: 2, name: "Content Generator AI", description: "Creates concise, tokenized summaries of news articles for micro-reading platforms.", category: "Content", reputation: 4.5, priceAvax: 0.01, calls: 9876 },
  { id: 3, name: "Identity Validator Agent", description: "Verifies user's on-chain reputation before granting access to premium services.", category: "Utility", reputation: 4.9, priceAvax: 0.02, calls: 3500 },
  { id: 4, name: "Supply Chain Tracker", description: "Logs sensor data onto a private subnet, triggered by X402 delivery confirmations.", category: "Logistics", reputation: 4.2, priceAvax: 0.03, calls: 5120 },
  { id: 5, name: "Smart Contract Auditor Agent", description: "AI-powered smart contract security analysis. Detects vulnerabilities, gas optimization opportunities, and compliance issues in Solidity contracts.", category: "Security", reputation: 4.9, priceAvax: 0.08, calls: 2340 },
];

const categories = ["All", "Finance", "Content", "Utility", "Logistics", "Security"];

const MarketplacePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1);
  const [minReputation, setMinReputation] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories from agents
  const availableCategories = useMemo(() => {
    const cats = new Set(mockAgents.map(a => a.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filter agents based on search and filters
  const filteredAgents = useMemo(() => {
    return mockAgents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
      
      const matchesPrice = agent.priceAvax >= minPrice && agent.priceAvax <= maxPrice;
      
      const matchesReputation = agent.reputation >= minReputation;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesReputation;
    });
  }, [searchQuery, selectedCategory, minPrice, maxPrice, minReputation]);

  // Calculate max price from agents
  const maxAgentPrice = Math.max(...mockAgents.map(a => a.priceAvax));

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMinPrice(0);
    setMaxPrice(maxAgentPrice);
    setMinReputation(0);
  };

  return (
    // Background: #0A0A0A
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-4xl font-bold mb-2 text-white">Agent Catalog</h2>
        <p className="text-zinc-400 mb-8">Discover and integrate autonomous AI agents powered by Avalanche X402.</p>

        {/* --- Search and Filter Bar --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
            <input 
              type="text" 
              placeholder="Search agents by name or use case..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-[#6E3C1B] rounded-lg py-2 pl-10 pr-4 text-white placeholder-zinc-400 focus:outline-none focus:border-[#CC4420]"
            />
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center bg-black border border-[#CC4420] py-2 px-4 rounded-lg text-white hover:bg-[#B85542] transition duration-200"
          >
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* --- Filter Panel --- */}
        {showFilters && (
          <div className="bg-black border border-[#CC4420] rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Filters</h3>
              <button 
                onClick={clearFilters}
                className="text-sm text-[#CC4420] hover:text-white transition"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#6E3C1B] rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#CC4420]"
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Price Range (USDC): {minPrice.toFixed(2)} - {maxPrice.toFixed(2)}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={maxAgentPrice}
                    step="0.01"
                    value={minPrice}
                    onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max={maxAgentPrice}
                    step="0.01"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Reputation Filter */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Min Reputation: {minReputation.toFixed(1)} / 5.0
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={minReputation}
                  onChange={(e) => setMinReputation(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-6 text-zinc-400">
          Showing {filteredAgents.length} of {mockAgents.length} agents
        </div>
        
        {/* --- Agent Grid --- */}
        {filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 text-lg">No agents found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-[#CC4420] hover:text-white transition"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default MarketplacePage;

