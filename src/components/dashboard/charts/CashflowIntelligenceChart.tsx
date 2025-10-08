"use client";

import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { CashflowEntry } from "@/lib/types";

interface CashflowIntelligenceChartProps {
  entries: CashflowEntry[];
  onRemove?: () => void;
}

function generateTransactionId(entry: CashflowEntry, idx: number) {
  return `txn_${idx.toString().padStart(3, "0")}`;
}

export const CashflowIntelligenceChart: React.FC<CashflowIntelligenceChartProps> = (props) => {
  const { entries, onRemove } = props;
  const [selectedEvent, setSelectedEvent] = useState<object | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Initialize CopilotKit chat hook
  const { appendMessage } = useCopilotChat();

  // Prepare chart data
  const chartData = entries.map((entry: CashflowEntry, idx: number) => ({
    ...entry,
    id: generateTransactionId(entry, idx),
  }));

  // Custom dot for balance line, handles click event
  interface CustomDotProps {
    cx: number;
    cy: number;
    value: number;
    index: number;
    key?: string | number;
  }

  const CustomDot = (props: CustomDotProps) => {
    const { cx, cy, value, index, key } = props;
    const entry = chartData[index];
    const isDip = value < 0;
    const isHovered = hoveredIndex === index;
    
    return (
      <circle
        key={key ?? `dot-${index}`}
        cx={cx}
        cy={cy}
        r={isDip ? 10 : 6}
        fill={isDip ? (isHovered ? "#c00" : "#e00") : "#0070f3"}
        stroke={isDip && isHovered ? "#333" : "none"}
        strokeWidth={isHovered ? 2 : 0}
        style={{ cursor: isDip ? "pointer" : "default", transition: "all 0.15s" }}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => {
          if (isDip) {
            const previous = chartData[index - 1]?.balance_after ?? null;
            const next = chartData[index + 1]?.balance_after ?? null;
            const relatedTransactions = [entry];
            setSelectedEvent({
              eventType: "balance_dip_click",
              date: entry.date,
              balanceOnDate: entry.balance_after,
              previousBalance: previous,
              nextBalance: next,
              relatedTransactions: relatedTransactions.map((tx) => ({
                id: tx.id,
                party: tx.party,
                amount: tx.amount,
                type: tx.type,
                expectedDate: tx.date,
              })),
            });
            setShowConfirm(true);
          }
        }}
      />
    );
  };

  const handleConfirm = () => {
    if (selectedEvent) {
      // Send the balance dip event to CopilotKit chat
      const eventData = selectedEvent as any;
      const messageContent = `🔴 Balance Dip Alert

I've detected a critical cashflow issue on ${eventData.date}:

Balance Details:
- Current Balance: $${eventData.balanceOnDate.toLocaleString()}
- Previous Balance: ${eventData.previousBalance !== null ? `$${eventData.previousBalance.toLocaleString()}` : 'N/A'}
- Next Balance: ${eventData.nextBalance !== null ? `$${eventData.nextBalance.toLocaleString()}` : 'N/A'}

Related Transaction:
${eventData.relatedTransactions.map((tx: any) => 
  `- ${tx.type === 'inflow' ? '💰' : '💸'} ${tx.party}: $${Math.abs(tx.amount).toLocaleString()} (${tx.type}) on ${tx.expectedDate}`
).join('\n')}

Can you help me understand what's causing this cashflow dip and suggest solutions to prevent negative balances?`;

      console.log('Sending message to CopilotKit:', messageContent);
      
      try {
        // Create a proper TextMessage object
        const message = new TextMessage({
          role: Role.User,
          content: messageContent,
        });
        
        appendMessage(message);
        console.log('Message sent successfully');
      } catch (error) {
        console.error('Error sending message to CopilotKit:', error);
      }
      
      setShowConfirm(false);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative w-full max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Cashflow Intelligence Graph</h2>
        {onRemove && (
          <button className="text-xs text-gray-500 hover:text-red-500" onClick={onRemove}>Remove</button>
        )}
      </div>
      <div className="w-full" style={{ minHeight: 280, height: '40vw', maxHeight: 480 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 32, right: 40, left: 10, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 14 }} minTickGap={18} />
            <YAxis tick={{ fontSize: 14 }} domain={["auto", "auto"]} />
            <Tooltip wrapperStyle={{ fontSize: "15px" }} />
            <Line type="monotone" dataKey="balance_after" stroke="#0070f3" dot={CustomDot} strokeWidth={4} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Confirmation dialog */}
      {showConfirm && selectedEvent && (
        <div className="absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3">🔴 Balance Dip Detected</h3>
            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-700">
                <strong>Date:</strong> {(selectedEvent as any).date}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Balance:</strong> <span className="text-red-600 font-semibold">${(selectedEvent as any).balanceOnDate.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-500">
                The AI agent will analyze this cashflow issue and suggest solutions.
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors" 
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedEvent(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium" 
                onClick={handleConfirm}
              >
                Send to Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};