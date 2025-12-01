import React from 'react';
import { Star, Zap } from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  description: string;
  category: string;
  reputation: number; // ERC-8004 Score (0.0 to 5.0)
  priceAvax: number; // X402 Micropayment Cost
  calls: number;
}

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    // Square border with corner decorations
    <div className="bg-black border border-gray-700 relative group transition-colors hover:bg-[#141416] p-6">
      {/* Corner decorations - Orange */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-3 border-t-2 border-[#CC4420]"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-3 border-t-2 border-[#CC4420]"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-3 border-b-2 border-[#CC4420]"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-3 border-b-2 border-[#CC4420]"></div>
      
      {/* Name and Category */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-white">{agent.name}</h3>
        <span className="text-xs font-mono px-3 py-1 rounded-full text-white border border-[#CC4420]">
          {agent.category}
        </span>
      </div>
      {/* Description */}
      <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{agent.description}</p>
      
      {/* Key Metrics - X402 Price & ERC-8004 Reputation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-white" />
          <div>
            <p className="text-lg font-semibold text-white">{agent.priceAvax} AVAX/call</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-5 h-5 fill-current text-white" />
          <div>
            <p className="text-sm text-zinc-400">Reputation</p>
            <p className="text-lg font-semibold text-white">{agent.reputation.toFixed(1)} / 5.0</p>
          </div>
        </div>
      </div>
      {/* CTA Button - White bg, white border, orange text */}
      <button className="w-full py-2 rounded-lg font-semibold text-white border border-transparent bg-[#CC4420] transition duration-300 hover:bg-white hover:text-black hover:border-transparent">
        Integrate Agent
      </button>
    </div>
  );
};

export default AgentCard;

