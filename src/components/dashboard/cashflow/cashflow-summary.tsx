"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CashflowModal } from "./cashflow-modal";
import { AgentState, AgentSetState } from "@/lib/types";

interface CashflowSummaryProps {
  state: AgentState | undefined;
  setState: AgentSetState<AgentState>;
}

export function CashflowSummary({ state, setState }: CashflowSummaryProps) {
  const cashflowEntries = state?.cashflowEntries || [];

  // Calculate summary
  const totalInflow = cashflowEntries
    .filter(entry => entry.type === "in")
    .reduce((sum, entry) => sum + entry.amount, 0);
    
  const totalOutflow = cashflowEntries
    .filter(entry => entry.type === "out")
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
    
  const netCashflow = totalInflow - totalOutflow;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  return (
    <Card className="shadow-none border-none bg-transparent">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Quick Summary</h3>
            <div className="flex gap-2 text-sm">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                In: {formatCurrency(totalInflow)}
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Out: {formatCurrency(totalOutflow)}
              </Badge>
              <Badge variant={netCashflow >= 0 ? "default" : "destructive"}>
                Net: {formatCurrency(netCashflow)}
              </Badge>
            </div>
          </div>
          <CashflowModal state={state} setState={setState} />
        </div>
      </CardContent>
    </Card>
  );
}