'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-500 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          <Link href="/" className="text-2xl font-bold text-white">
            AgentPay
          </Link>
          <Link href="/marketplace" className="absolute left-1/2 transform -translate-x-1/2 text-white hover:text-zinc-400 transition">
            Marketplace
          </Link>
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

