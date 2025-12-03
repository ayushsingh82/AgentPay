"use client";

import React from "react";

interface PaymentCardProps {
  tier: string;
  price: string;
  description: string;
  onPayClick: () => void;
  isPaying: boolean;
}

export function PaymentCard({
  tier,
  price,
  description,
  onPayClick,
  isPaying,
}: PaymentCardProps) {
  return (
    <div className="bg-black border border-gray-700 relative group transition-colors hover:bg-[#141416] p-6 min-w-[280px] flex-1">
      {/* Corner decorations - Orange */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#CC4420]"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#CC4420]"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#CC4420]"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#CC4420]"></div>
      
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-white mb-2">{tier}</h3>
        <p className="text-3xl font-bold text-[#CC4420] mb-2">{price}</p>
        <p className="text-sm text-zinc-400">{description}</p>
      </div>
      
      <button
        onClick={onPayClick}
        disabled={isPaying}
        className="w-full py-2 rounded-lg font-semibold text-white border border-transparent bg-[#CC4420] transition duration-300 hover:bg-white hover:text-black hover:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPaying ? "Processing..." : "Pay & Access"}
      </button>
    </div>
  );
}

