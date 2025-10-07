"use client"
import { CashflowSummaryToggle } from "./CashflowSummaryToggle";
import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PinnedMetrics } from "@/components/dashboard/layout/metrics";
import { Charts } from "@/components/dashboard/layout/charts";
import React from "react";
import { CashflowIntelligenceChart } from "./charts/CashflowIntelligenceChart";
import { 
  useChartActions,
  useSearchActions
} from "@/components/chat/actions";
import mockCashflow from "../../../data/MOCK.json";

export function MainLayout({ className }: { className?: string }) {
  const [showIntelligenceChart, setShowIntelligenceChart] = React.useState(true);
  const [agentSuggestions, setAgentSuggestions] = React.useState<React.ReactNode>(null);
  const { state, setState } = useCoAgent<AgentState>({
    name: "my_agent",
    initialState: {
      cashflowEntries: mockCashflow
    }
  })

  // Setup tool rendering and front-end tools
  useChartActions({ state, setState });
  useSearchActions();

  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      <div className="max-w-6xl mx-auto p-4 grid gap-4">
        {showIntelligenceChart && state.cashflowEntries && (
          <CashflowIntelligenceChart
            entries={state.cashflowEntries}
            onSendEvent={(event) => {
              // Send raw event to agent (stub: set suggestions)
              setAgentSuggestions(
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-2">
                  <strong>Agent Suggestions:</strong>
                  <pre className="text-xs mt-1">{JSON.stringify(event, null, 2)}</pre>
                  <div className="mt-2 text-sm text-gray-700">(Agent response would appear here)</div>
                </div>
              );
            }}
            suggestions={agentSuggestions}
            onRemove={() => setShowIntelligenceChart(false)}
          />
        )}
        <PinnedMetrics state={state} setState={setState} />
        <Charts state={state} setState={setState} />
        {/* Cashflow summary hidden by default, shown via button */}
        {state.cashflowEntries && (
          <CashflowSummaryToggle entries={state.cashflowEntries} />
        )}
        {/* Option to restore chart if removed */}
        {!showIntelligenceChart && (
          <button className="bg-primary text-white px-4 py-2 rounded shadow mb-4" onClick={() => setShowIntelligenceChart(true)}>
            Show Cashflow Intelligence Chart
          </button>
        )}

      </div>
    </div>
  );
}