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
    // Box background: #1A0A05, Border: #CC4420
    <div className="bg-[#1A0A05] backdrop-blur-sm border border-[#CC4420] p-6 rounded-xl shadow-lg hover:shadow-[#CC4420]/20 transition duration-300 ease-in-out hover:scale-[1.02]">
      
      {/* Name and Category */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-white">{agent.name}</h3>
        <span className="text-xs font-mono px-3 py-1 rounded-full text-[#FF7F50] border border-[#CC4420]">
          {agent.category}
        </span>
      </div>
      {/* Description */}
      <p className="text-[#9CA3AF] text-sm mb-4 line-clamp-2">{agent.description}</p>
      
      {/* Key Metrics - X402 Price & ERC-8004 Reputation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-[#FF7F50]" />
          <div>
            <p className="text-sm text-[#9CA3AF]">X402 Price</p>
            <p className="text-lg font-semibold text-white">{agent.priceAvax} AVAX/call</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-5 h-5 fill-current text-[#FF7F50]" />
          <div>
            <p className="text-sm text-[#9CA3AF]">Reputation</p>
            <p className="text-lg font-semibold text-white">{agent.reputation.toFixed(1)} / 5.0</p>
          </div>
        </div>
      </div>
      {/* CTA Button - Button BG: #B85542 */}
      <button className="w-full py-2 rounded-lg font-semibold text-white transition duration-300 bg-[#B85542] hover:bg-[#CC4420]">
        Integrate Agent
      </button>
    </div>
  );
};

export default AgentCard;

