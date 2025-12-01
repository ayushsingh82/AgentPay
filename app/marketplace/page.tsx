import React from 'react';
import AgentCard from '@/app/components/AgentCard';
import { SlidersHorizontal, Search } from 'lucide-react';

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
  { id: 3, name: "Identity Validator Agent", description: "Verifies user's ERC-8004 on-chain reputation before granting access to premium services.", category: "Utility", reputation: 4.9, priceAvax: 0.02, calls: 3500 },
  { id: 4, name: "Supply Chain Tracker", description: "Logs sensor data onto a private subnet, triggered by X402 delivery confirmations.", category: "Logistics", reputation: 4.2, priceAvax: 0.03, calls: 5120 },
];

const MarketplacePage: React.FC = () => {
  return (
    // Background: #0A0A0A
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 p-8 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-4xl font-bold mb-2 text-white">Agent Catalog</h2>
        <p className="text-zinc-400 mb-8">Discover and integrate autonomous AI agents powered by Avalanche X402.</p>

        {/* --- Search and Filter Bar --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
            <input 
              type="text" 
              placeholder="Search agents by name or use case..." 
              className="w-full bg-black border border-[#6E3C1B] rounded-lg py-2 pl-10 pr-4 text-white placeholder-zinc-400 focus:outline-none focus:border-[#CC4420]"
            />
          </div>
          
          <button className="flex items-center justify-center bg-black border border-[#CC4420] py-2 px-4 rounded-lg text-white hover:bg-[#B85542] transition duration-200">
            <SlidersHorizontal className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>
        
        {/* --- Agent Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockAgents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default MarketplacePage;

