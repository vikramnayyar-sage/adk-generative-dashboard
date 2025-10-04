
"use client";
import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CashflowModal } from "./cashflow-modal";
import { CashflowBalanceModal } from "./cashflow-balance-modal";
import { AgentState, AgentSetState } from "@/lib/types";

interface CashflowSummaryProps {
  state: AgentState | undefined;
  setState: AgentSetState<AgentState>;
}

export function CashflowSummary({ state, setState }: CashflowSummaryProps) {
  const [isBalanceModalOpen, setIsBalanceModalOpen] = React.useState(false);
  const cashflowEntries: { amount: number; type: "in" | "out" }[] = state?.cashflowEntries || [];

  // Calculate summary
  const totalInflow = cashflowEntries
    .filter((entry: { amount: number; type: "in" | "out" }) => entry.type === "in")
    .reduce((sum: number, entry: { amount: number; type: "in" | "out" }) => sum + entry.amount, 0);

  const totalOutflow = cashflowEntries
    .filter((entry: { amount: number; type: "in" | "out" }) => entry.type === "out")
    .reduce((sum: number, entry: { amount: number; type: "in" | "out" }) => sum + Math.abs(entry.amount), 0);

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
          <div className="flex items-center gap-2">
            <CashflowModal state={state} setState={setState} />
            <button
              className="bg-blue-100 text-blue-800 rounded px-2 py-1 font-semibold text-sm border-none cursor-pointer"
              onClick={() => setIsBalanceModalOpen(true)}
            >
              Set Starting Balance (${state?.startingBalance ?? 0})
            </button>
            <CashflowBalanceModal
              isOpen={isBalanceModalOpen}
              setIsOpen={setIsBalanceModalOpen}
              state={state}
              setState={setState}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}