"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign } from "lucide-react";
import { CashflowTable } from "./cashflow-table";
import { AgentState, AgentSetState, CashflowEntry } from "@/lib/types";

interface CashflowModalProps {
  state: AgentState | undefined;
  setState: AgentSetState<AgentState>;
}

export function CashflowModal({ state, setState }: CashflowModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const cashflowEntries = state?.cashflowEntries || [];
  const customers = [...(state?.creditors || []), ...(state?.debitors || [])];

  const handleAddEntry = (newEntry: Omit<CashflowEntry, "id">) => {
    const nextId = Math.max(0, ...cashflowEntries.map(e => e.id)) + 1;
    const entryWithId: CashflowEntry = { ...newEntry, id: nextId };
    setState(prevState => ({
      title: prevState?.title || "Dashboard",
      charts: prevState?.charts || [],
      pinnedMetrics: prevState?.pinnedMetrics || [],
      cashflowEntries: [...cashflowEntries, entryWithId],
      startingBalance: prevState?.startingBalance ?? 0,
      creditors: prevState?.creditors ?? [],
      debitors: prevState?.debitors ?? []
    }));
  };

  const handleRemoveEntry = (id: number) => {
    setState(prevState => ({
      title: prevState?.title || "Dashboard",
      charts: prevState?.charts || [],
      pinnedMetrics: prevState?.pinnedMetrics || [],
      cashflowEntries: cashflowEntries.filter(entry => entry.id !== id),
      startingBalance: prevState?.startingBalance ?? 0,
      creditors: prevState?.creditors ?? [],
      debitors: prevState?.debitors ?? []
    }));
  };

  // Calculate summary for the trigger button
  const totalInflow = cashflowEntries
    .filter(entry => entry.type === "in")
    .reduce((sum, entry) => sum + entry.amount, 0);
    
  const totalOutflow = cashflowEntries
    .filter(entry => entry.type === "out")
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
    
  const netCashflow = totalInflow - totalOutflow;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200"
          title="Manage Cashflow"
        >
          <DollarSign className="h-4 w-4" />
          <span className="hidden sm:inline">Cashflow</span>
          <span className={`text-xs px-1.5 py-0.5 rounded ${
            netCashflow >= 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            ${Math.abs(netCashflow).toLocaleString()}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[98vw] max-w-none h-[85vh] overflow-hidden rounded-xl shadow-2xl bg-white border border-gray-200 p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <DollarSign className="h-5 w-5 text-green-600" />
            Cashflow Management
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 p-6">
          <CashflowTable
            entries={cashflowEntries}
            onAddEntry={handleAddEntry}
            onRemoveEntry={handleRemoveEntry}
            isModal={true}
            customers={customers}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}