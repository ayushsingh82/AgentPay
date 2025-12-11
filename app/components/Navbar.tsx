'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-500 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="focus:outline-none">
            <div className="bg-[#CC4420] border-2 border-white shadow-[3px_3px_0_0_rgba(255,255,255,1)] px-3 py-1 rounded-lg cursor-pointer hover:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200">
              <span className="text-2xl font-black text-white">AgentPay</span>
            </div>
          </Link>
          <div className="flex items-center">
            <ConnectButton showBalance />
          </div>
        </div>
      </div>
    </nav>
  );
}

