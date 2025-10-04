"use client";

import { useCopilotAction } from "@copilotkit/react-core";
import { AgentState, AgentSetState, CashflowEntry } from "@/lib/types";

interface UseCashflowActionsProps {
  state: AgentState | undefined;
  setState: AgentSetState<AgentState>;
}

export const useCashflowActions = ({ state, setState }: UseCashflowActionsProps) => {
  // Add Cashflow Entry Action
  useCopilotAction({
    name: "add_cashflow_entry",
    description: "Add a new cashflow entry to the dashboard. Use positive amounts for inflows and negative for outflows.",
    parameters: [
      { name: "name", type: "string", required: true, description: "Name or description of the cashflow entry" },
      { name: "amount", type: "number", required: true, description: "Amount (positive for inflow, negative for outflow)" },
      { name: "dateDue", type: "string", required: true, description: "Due date in YYYY-MM-DD format" },
      { name: "type", type: "string", required: true, description: "Type of cashflow: 'in' for inflow or 'out' for outflow" },
    ],
    handler: async ({ name, amount, dateDue, type }) => {
      const currentEntries = state?.cashflowEntries || [];
      const nextId = Math.max(0, ...currentEntries.map(e => e.id)) + 1;
      
      const newEntry: CashflowEntry = {
        id: nextId,
        name,
        amount: Math.abs(amount), // Store as positive, type determines sign
        dateDue,
        type: type as "in" | "out"
      };

      setState(prevState => ({
        ...prevState,
        title: prevState?.title || "Dashboard",
        charts: prevState?.charts || [],
        pinnedMetrics: prevState?.pinnedMetrics || [],
        cashflowEntries: [...currentEntries, newEntry]
      }));

      return `Successfully added cashflow entry: ${name} for ${type === "in" ? "+" : "-"}$${Math.abs(amount)} due ${dateDue}`;
    },
  });

  // Remove Cashflow Entry Action
  useCopilotAction({
    name: "remove_cashflow_entry",
    description: "Remove a cashflow entry from the dashboard by ID or name.",
    parameters: [
      { name: "identifier", type: "string", required: true, description: "ID (number) or name of the entry to remove" },
    ],
    handler: async ({ identifier }) => {
      const currentEntries = state?.cashflowEntries || [];
      
      // Try to find by ID first, then by name
      const entryToRemove = currentEntries.find(entry => 
        entry.id.toString() === identifier || 
        entry.name.toLowerCase().includes(identifier.toLowerCase())
      );

      if (!entryToRemove) {
        return `Cashflow entry with identifier "${identifier}" not found. Available entries: ${currentEntries.map(e => `${e.id}: ${e.name}`).join(", ")}`;
      }

      const updatedEntries = currentEntries.filter(entry => entry.id !== entryToRemove.id);

      setState(prevState => ({
        ...prevState,
        title: prevState?.title || "Dashboard",
        charts: prevState?.charts || [],
        pinnedMetrics: prevState?.pinnedMetrics || [],
        cashflowEntries: updatedEntries
      }));

      return `Successfully removed cashflow entry: ${entryToRemove.name}`;
    },
  });

  // Update Cashflow Entry Action
  useCopilotAction({
    name: "update_cashflow_entry",
    description: "Update an existing cashflow entry by ID or name.",
    parameters: [
      { name: "identifier", type: "string", required: true, description: "ID (number) or name of the entry to update" },
      { name: "name", type: "string", required: false, description: "New name for the entry" },
      { name: "amount", type: "number", required: false, description: "New amount" },
      { name: "dateDue", type: "string", required: false, description: "New due date in YYYY-MM-DD format" },
      { name: "type", type: "string", required: false, description: "New type: 'in' or 'out'" },
    ],
    handler: async ({ identifier, name, amount, dateDue, type }) => {
      const currentEntries = state?.cashflowEntries || [];
      
      const entryIndex = currentEntries.findIndex(entry => 
        entry.id.toString() === identifier || 
        entry.name.toLowerCase().includes(identifier.toLowerCase())
      );

      if (entryIndex === -1) {
        return `Cashflow entry with identifier "${identifier}" not found. Available entries: ${currentEntries.map(e => `${e.id}: ${e.name}`).join(", ")}`;
      }

      const updatedEntries = [...currentEntries];
      const originalEntry = updatedEntries[entryIndex];
      
      updatedEntries[entryIndex] = {
        ...originalEntry,
        ...(name && { name }),
        ...(amount !== undefined && { amount: Math.abs(amount) }),
        ...(dateDue && { dateDue }),
        ...(type && { type: type as "in" | "out" })
      };

      setState(prevState => ({
        ...prevState,
        title: prevState?.title || "Dashboard",
        charts: prevState?.charts || [],
        pinnedMetrics: prevState?.pinnedMetrics || [],
        cashflowEntries: updatedEntries
      }));

      return `Successfully updated cashflow entry: ${updatedEntries[entryIndex].name}`;
    },
  });

  // Get Cashflow Summary Action
  useCopilotAction({
    name: "get_cashflow_summary",
    description: "Get a summary of all cashflow entries including totals and net cashflow.",
    parameters: [],
    handler: async () => {
      const entries = state?.cashflowEntries || [];
      
      if (entries.length === 0) {
        return "No cashflow entries found.";
      }

      const totalInflow = entries
        .filter(entry => entry.type === "in")
        .reduce((sum, entry) => sum + entry.amount, 0);
        
      const totalOutflow = entries
        .filter(entry => entry.type === "out")
        .reduce((sum, entry) => sum + entry.amount, 0);
        
      const netCashflow = totalInflow - totalOutflow;

      const summary = {
        totalEntries: entries.length,
        totalInflow: totalInflow,
        totalOutflow: totalOutflow,
        netCashflow: netCashflow,
        entries: entries.map(entry => ({
          id: entry.id,
          name: entry.name,
          amount: entry.amount,
          dateDue: entry.dateDue,
          type: entry.type
        }))
      };

      return `Cashflow Summary:
- Total Entries: ${summary.totalEntries}
- Total Inflow: $${summary.totalInflow.toFixed(2)}
- Total Outflow: $${summary.totalOutflow.toFixed(2)}
- Net Cashflow: $${summary.netCashflow.toFixed(2)}

Recent entries: ${entries.slice(-3).map(e => `${e.name} (${e.type === "in" ? "+" : "-"}$${e.amount})`).join(", ")}`;
    },
  });
};