"use client";

import { CashflowTable } from "./cashflow-table";
import { AgentState, AgentSetState, CashflowEntry } from "@/lib/types";

interface CashflowSectionProps {
  state: AgentState | undefined;
  setState: AgentSetState<AgentState>;
}

export function CashflowSection({ state, setState }: CashflowSectionProps) {
  const cashflowEntries = state?.cashflowEntries || [];

  const handleAddEntry = (newEntry: Omit<CashflowEntry, "id">) => {
    const nextId = Math.max(0, ...cashflowEntries.map(e => e.id)) + 1;
    const entryWithId: CashflowEntry = { ...newEntry, id: nextId };
    
    setState(prevState => ({
      ...prevState,
      title: prevState?.title || "Dashboard",
      charts: prevState?.charts || [],
      pinnedMetrics: prevState?.pinnedMetrics || [],
      cashflowEntries: [...cashflowEntries, entryWithId]
    }));
  };

  const handleRemoveEntry = (id: number) => {
    setState(prevState => ({
      ...prevState,
      title: prevState?.title || "Dashboard",
      charts: prevState?.charts || [],
      pinnedMetrics: prevState?.pinnedMetrics || [],
      cashflowEntries: cashflowEntries.filter(entry => entry.id !== id)
    }));
  };

  return (
    <CashflowTable
      entries={cashflowEntries}
      onAddEntry={handleAddEntry}
      onRemoveEntry={handleRemoveEntry}
    />
  );
}