'use client';

import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-500 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white">
            x402
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/marketplace" className="text-white hover:text-zinc-400 transition">
              Marketplace
            </Link>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

