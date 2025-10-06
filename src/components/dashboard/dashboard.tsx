import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PinnedMetrics } from "@/components/dashboard/layout/metrics";
import { Charts } from "@/components/dashboard/layout/charts";
import { CashflowSummary } from "@/components/dashboard/cashflow";
import { 
  useChartActions,
  useSearchActions,
  useCashflowActions
} from "@/components/chat/actions";

export function MainLayout({ className }: { className?: string }) {
  const { state, setState } = useCoAgent<AgentState>({
    name: "my_agent",
  })

  // Setup tool rendering and front-end tools
  useChartActions({ state, setState });
  useSearchActions();
  useCashflowActions({ state, setState });

  return (
    <div className={cn("min-h-screen bg-gray-50 text-gray-900", className)}>
      <div className="max-w-5xl mx-auto p-8 grid gap-8 bg-white rounded-xl shadow-lg mt-8">
        <PinnedMetrics state={state} setState={setState} />
        <Charts state={state} setState={setState} />
        <CashflowSummary state={state} setState={setState} />
      </div>
    </div>
  );
}