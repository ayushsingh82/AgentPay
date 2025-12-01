import React from 'react';
import Link from 'next/link';

const HeroLanding: React.FC = () => {
  return (
    // Background color: #0A0A0A with orange gradient on ends
    <section className="min-h-screen bg-[#0A0A0A] text-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Orange gradient on left end - more intense */}
      <div className="absolute left-0 top-0 w-96 h-full bg-gradient-to-r from-[#CC4420]/50 to-transparent pointer-events-none"></div>
      {/* Orange gradient on right end - more intense */}
      <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-[#CC4420]/50 to-transparent pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto text-center z-10 relative">
        {/* --- Branding & Headline --- */}
        <div className="inline-block mb-4">
          <span className="text-sm font-mono tracking-widest text-white border border-[#CC4420] px-4 py-2 rounded">
            AVALANCHE X402 + ERC8004
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight text-white">
          Autonomous <span className="bg-[#CC4420] px-2">Agents</span>.
          <br /> 
          Instant <span className="bg-[#CC4420] px-2">Payments</span>.
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-10">
          The Decentralized Marketplace for AI-Powered Services, secured by Avalanche's speed, X402 Micropayments, and ERC-8004 identity.
        </p>
        
        {/* --- CTAs --- */}
        <div className="flex justify-center space-x-4">
          <Link href="/marketplace">
            <button className="px-8 py-3 rounded-lg font-semibold text-lg text-[#CC4420] border border-white bg-white transition duration-300 ease-in-out transform hover:scale-105 hover:bg-[#CC4420] hover:text-white hover:border-transparent">
              Explore Agents
            </button>
          </Link>
          <Link href="/docs">
            <button className="px-8 py-3 rounded-lg font-semibold text-lg border-2 border-[#CC4420] text-white hover:bg-[#CC4420]/10 transition duration-300 ease-in-out">
              Deploy Your Agent ↗
            </button>
          </Link>
        </div>
      </div>
      {/* More intense background glow effects */}
      <div className="absolute w-96 h-96 bg-[#CC4420]/30 rounded-full blur-3xl opacity-60 bottom-10 left-10 animate-pulse pointer-events-none"></div>
      <div className="absolute w-96 h-96 bg-[#CC4420]/25 rounded-full blur-3xl opacity-50 top-10 right-10 animate-pulse pointer-events-none"></div>
    </section>
  );
};

export default HeroLanding;

