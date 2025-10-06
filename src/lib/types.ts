export type Customer = {
  id: number;
  businessName: string;
  phoneNumber?: string;
  emailAddress?: string;
  links?: string;
};
export type LineChartSpec = { type: "line"; title: string; x: string; y: string };
export type BarChartSpec = { type: "bar"; title: string; x: string; y: string };
export type PieChartSpec = { type: "pie"; title: string; x: string; y: string };
export type TableChartSpec = { type: "table"; title: string; columns: string[]; data: ChartDataRecord[] };
export type ScalarChartSpec = { type: "scalar"; title: string; value: number | string };
export type HeatMapChartSpec = { type: "heatmap"; title: string; matrix: number[][]; xLabels: string[]; yLabels: string[] };
export type StackedBarChartSpec = { type: "stackedBar" | "groupBar"; title: string; x: string; groups: string[]; data: ChartDataRecord[] };
export type TreeMapChartSpec = { type: "treemap"; title: string; nodes: { label: string; value: number; children?: TreeMapChartSpec["nodes"] }[] };
export type ChartSpec = LineChartSpec | BarChartSpec | PieChartSpec | TableChartSpec | ScalarChartSpec | HeatMapChartSpec | StackedBarChartSpec | TreeMapChartSpec;

// Data records supplied by the agent for charts
export type ChartDataRecord = Record<string, string | number>;
export type ChartDataMap = Record<string, ChartDataRecord[]>; // keyed by chart title

export type Metric = {
  id: string;
  title: string;
  value: string;
  hint?: string;
  icon?: "users" | "mrr" | "conversion" | "churn" | "custom";
};

export type CashflowEntry = {
  id: number;
  name: string;
  amount: number;
  dateDue: string;
  type: "in" | "out";
  customerId?: number;
};

export type Chart =
  | (LineChartSpec & { data: ChartDataRecord[] })
  | (BarChartSpec & { data: ChartDataRecord[] })
  | (PieChartSpec & { data: ChartDataRecord[] })
  | TableChartSpec
  | ScalarChartSpec
  | HeatMapChartSpec
  | StackedBarChartSpec
  | TreeMapChartSpec;

export interface AgentState {
  title: string;
  charts: Chart[];
  pinnedMetrics: Metric[];
  cashflowEntries: CashflowEntry[];
  startingBalance: number;
  creditors: Customer[];
  debitors: Customer[];
  customers?: Customer[];
  totalInflow?: number;
  totalOutflow?: number;
  netCashflow?: number;
}

export type AgentSetState<T extends AgentState> = (newState: T | ((prevState: T | undefined) => T)) => void

export const initialState: AgentState = {
  title: "Dashboard",
  charts: [
    {
      type: "line",
      title: "Sales by day",
      x: "x",
      y: "y",
      data: [
        { x: "2024-01-01", y: 100 },
        { x: "2024-01-02", y: 200 },
        { x: "2024-01-03", y: 300 }
      ]
    },
    {
      type: "bar",
      title: "Sales by product",
      x: "x",
      y: "y",
      data: [
        { x: "Smartphone", y: 100 },
        { x: "Tablet", y: 200 },
        { x: "Laptop", y: 300 }
      ]
    }
  ],
  pinnedMetrics: [
    {
      id: "1",
      title: "Total sales",
      value: "1000",
      hint: "Total sales for the last 30 days",
      icon: "mrr"
    },
    {
      id: "2",
      title: "Best selling product",
      value: "Laptop",
      hint: "Total sales for the last 30 days",
      icon: "conversion"
    }
  ],
  cashflowEntries: [],
  startingBalance: 0,
  creditors: [],
  debitors: [],
  customers: []
};
