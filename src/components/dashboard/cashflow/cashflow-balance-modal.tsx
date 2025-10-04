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
      {/* DialogTrigger removed; modal is now opened only from summary button */}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Set Starting Balance
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <label className="font-medium">Starting Balance (USD)</label>
          <input
            type="number"
            className="border rounded px-3 py-2 text-lg"
            value={balance}
            onChange={e => setBalance(Number(e.target.value))}
            min={0}
          />
          <Button onClick={handleSave} className="mt-2">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
