"use client";

import React from "react";

interface ContentDisplayProps {
  tier: string;
  data: string;
  features?: string[];
  timestamp: string;
}

export function ContentDisplay({
  tier,
  data,
  features,
  timestamp,
}: ContentDisplayProps) {
  return (
    <div className="bg-black border border-gray-700 relative p-6">
      {/* Corner decorations - Orange */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#CC4420]"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#CC4420]"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#CC4420]"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#CC4420]"></div>
      
      <div className="mb-4">
        <span className="text-xs font-mono px-3 py-1 rounded-full text-white border border-[#CC4420] inline-block mb-4">
          {tier.toUpperCase()}
        </span>
        <p className="text-lg text-white mb-4">{data}</p>
        {features && features.length > 0 && (
          <ul className="list-disc list-inside space-y-2 text-zinc-400">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
        <p className="text-xs text-zinc-500 mt-4">
          Unlocked at: {new Date(timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

