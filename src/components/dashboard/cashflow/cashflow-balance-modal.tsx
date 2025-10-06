"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign } from "lucide-react";
import { AgentState, AgentSetState } from "@/lib/types";

interface CashflowBalanceModalProps {
  state: AgentState | undefined;
  setState: AgentSetState<AgentState>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function CashflowBalanceModal({ state, setState, isOpen, setIsOpen }: CashflowBalanceModalProps) {
  const [balance, setBalance] = useState(state?.startingBalance ?? 0);

  const handleSave = () => {
    setState(prevState => ({
      title: prevState?.title || "Dashboard",
      charts: prevState?.charts || [],
      pinnedMetrics: prevState?.pinnedMetrics || [],
      cashflowEntries: prevState?.cashflowEntries || [],
      startingBalance: balance
    }));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md rounded-xl shadow-2xl bg-white p-6 border border-gray-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <DollarSign className="h-5 w-5 text-green-600" />
            Set Starting Balance
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <label className="font-medium text-gray-700">Starting Balance (USD)</label>
          <input
            type="number"
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={balance}
            onChange={e => setBalance(Number(e.target.value))}
            min={0}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow hover:bg-green-700 transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
// ...existing code...
}
