"use client";

import React from "react";

interface SeparatorProps {
  className?: string;
}

export function Separator({ className = "" }: SeparatorProps) {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent ${className}`} />
  );
}

