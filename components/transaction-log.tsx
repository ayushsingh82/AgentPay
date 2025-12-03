"use client";

import React from "react";
import { CheckCircle2, XCircle, Info, Clock } from "lucide-react";

export interface LogEntry {
  message: string;
  type: "success" | "error" | "info" | "pending";
  timestamp: Date;
}

interface TransactionLogProps {
  logs: LogEntry[];
}

export function TransactionLog({ logs }: TransactionLogProps) {
  const getIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
    }
  };

  const getTextColor = (type: LogEntry["type"]) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "error":
        return "text-red-400";
      case "info":
        return "text-blue-400";
      case "pending":
        return "text-yellow-400";
    }
  };

  return (
    <div className="bg-black border border-gray-700 relative p-6">
      {/* Corner decorations - Orange */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#CC4420]"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#CC4420]"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#CC4420]"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#CC4420]"></div>
      
      <h3 className="text-xl font-bold text-white mb-4">Transaction Log</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-[#141416] rounded border border-gray-800"
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(log.type)}</div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${getTextColor(log.type)}`}>
                {log.message}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {log.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

