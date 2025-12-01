import React from 'react';
import Link from 'next/link';

const HeroLanding: React.FC = () => {
  return (
    // Background color: #0A0A0A
    <section className="min-h-screen bg-[#0A0A0A] text-gray-100 flex items-center justify-center p-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center z-10">
        {/* --- Branding & Headline --- */}
        <p className="text-xl font-mono mb-4 tracking-widest text-[#FF7F50]">
          AVALANCHE X402 + ERC8004
        </p>
        
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF7F50] to-[#CC4420]">
            Autonomous Agents.
          </span>
          <br /> 
          Instant Payments.
        </h1>
        
        <p className="text-xl md:text-2xl text-[#9CA3AF] max-w-3xl mx-auto mb-10">
          The Decentralized Marketplace for **AI-Powered Services**, secured by **Avalanche**'s speed, **X402 Micropayments**, and **ERC-8004** identity.
        </p>
        
        {/* --- CTAs --- */}
        <div className="flex justify-center space-x-4">
          <Link href="/marketplace">
            <button className="px-8 py-3 rounded-lg font-semibold text-lg text-white transition duration-300 ease-in-out transform hover:scale-105 bg-[#B85542] hover:bg-[#CC4420]">
              Explore Agents
            </button>
          </Link>
          <Link href="/docs">
            <button className="px-8 py-3 rounded-lg font-semibold text-lg border-2 border-[#CC4420] text-[#FF7F50] hover:bg-[#CC4420]/10 transition duration-300 ease-in-out">
              Deploy Your Agent ↗
            </button>
          </Link>
        </div>
      </div>
      {/* Optional: Subtle background glow effect */}
      <div className="absolute w-96 h-96 bg-[#CC4420]/10 rounded-full blur-3xl opacity-30 bottom-10 left-10 animate-pulse pointer-events-none"></div>
    </section>
  );
};

export default HeroLanding;

