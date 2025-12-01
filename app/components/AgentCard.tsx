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
  const ACCENT_COLOR_CLASS = 'text-cyan-400';
  const BUTTON_BG_CLASS = 'bg-cyan-500 hover:bg-cyan-600';

  return (
    // Sleek, slightly glowing card on black background
    <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 p-6 rounded-xl shadow-lg hover:shadow-cyan-500/20 transition duration-300 ease-in-out hover:scale-[1.02]">
      
      {/* Name and Category */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-50">{agent.name}</h3>
        <span className={`text-xs font-mono px-3 py-1 rounded-full ${ACCENT_COLOR_CLASS} border border-cyan-500/50`}>
          {agent.category}
        </span>
      </div>
      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{agent.description}</p>
      
      {/* Key Metrics - X402 Price & ERC-8004 Reputation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Zap className={`w-5 h-5 ${ACCENT_COLOR_CLASS}`} />
          <div>
            <p className="text-sm text-gray-400">X402 Price</p>
            <p className="text-lg font-semibold text-white">{agent.priceAvax} AVAX/call</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className={`w-5 h-5 fill-current ${ACCENT_COLOR_CLASS}`} />
          <div>
            <p className="text-sm text-gray-400">Reputation</p>
            <p className="text-lg font-semibold text-white">{agent.reputation.toFixed(1)} / 5.0</p>
          </div>
        </div>
      </div>
      {/* CTA Button */}
      <button className={`w-full py-2 rounded-lg font-semibold text-black transition duration-300 ${BUTTON_BG_CLASS}`}>
        Integrate Agent
      </button>
    </div>
  );
};

export default AgentCard;

