import { useMemo } from "react";
import { ResponsiveContainer, LineChart as RLineChart, Line, XAxis, YAxis, CartesianGrid, BarChart as RBarChart, Bar, PieChart as RPieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import type { TableChartSpec, ScalarChartSpec, HeatMapChartSpec, StackedBarChartSpec, TreeMapChartSpec, ChartSpec, LineChartSpec, BarChartSpec, PieChartSpec, ChartDataRecord } from "@/lib/types";

function TableChart({ spec }: { spec: TableChartSpec }) {
  // TODO: Implement table rendering
  return (
    <div className="bg-white border rounded p-4">
      <div className="font-bold mb-2">{spec.title}</div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            {spec.columns?.map((col: string) => <th key={col} className="border-b p-2 text-left">{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {spec.data?.map((row, i) => (
            <tr key={i}>
              {spec.columns?.map((col: string) => <td key={col} className="border-b p-2">{row[col]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        );
      }

      function ScalarChart({ spec }: { spec: ScalarChartSpec }) {
  // TODO: Implement scalar rendering
  return (
    <div className="bg-white border rounded p-4 flex flex-col items-center justify-center">
      <div className="font-bold mb-2">{spec.title}</div>
      <div className="text-3xl font-mono text-blue-700">{spec.value}</div>
    </div>
  );
}

function HeatMapChart({ spec }: { spec: HeatMapChartSpec }) {
  // TODO: Implement heatmap rendering
  return (
    <div className="bg-white border rounded p-4">
      <div className="font-bold mb-2">{spec.title}</div>
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th></th>
            {spec.xLabels?.map((x: string) => <th key={x}>{x}</th>)}
          </tr>
        </thead>
        <tbody>
          {spec.matrix?.map((row: number[], i: number) => (
            <tr key={i}>
              <td className="font-bold">{spec.yLabels?.[i]}</td>
              {row.map((val: number, j: number) => (
                <td key={j} style={{ background: `rgba(25, 118, 210, ${Math.min(1, val / 10)})`, color: val > 5 ? 'white' : 'black' }}>
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StackedBarChart({ spec }: { spec: StackedBarChartSpec }) {
  // TODO: Implement stacked/group bar rendering
  return (
    <div className="bg-white border rounded p-4">
      <div className="font-bold mb-2">{spec.title}</div>
      <div className="text-xs">Stacked/group bar chart rendering coming soon.</div>
    </div>
  );
}

function TreeMapChart({ spec }: { spec: TreeMapChartSpec }) {
  // TODO: Implement treemap rendering
  return (
    <div className="bg-white border rounded p-4">
      <div className="font-bold mb-2">{spec.title}</div>
      <div className="text-xs">Treemap rendering coming soon.</div>
    </div>
  );
  }

// Accessible, high-contrast color palette for charts
const chartColors = [
  "#1976d2", // blue
  "#d32f2f", // red
  "#388e3c", // green
  "#fbc02d", // yellow
  "#7b1fa2", // purple
  "#f57c00", // orange
  "#0288d1", // cyan
  "#c2185b", // magenta
  "#455a64", // dark gray
  "#8bc34a"  // light green
];

function LineChart({ spec, data }: { spec: LineChartSpec; data: ChartDataRecord[] }) {
  const config: ChartConfig = useMemo(() => ({
    [spec.y]: { label: spec.y, color: chartColors[0] },
  }), [spec.y]);

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={spec.x} tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line type="monotone" dataKey={spec.y} stroke={chartColors[0]} strokeWidth={2} dot={false} />
        </RLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function BarChart({ spec, data }: { spec: BarChartSpec; data: ChartDataRecord[] }) {
  const config: ChartConfig = useMemo(() => ({
    [spec.y]: { label: spec.y, color: chartColors[1] },
  }), [spec.y]);

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={spec.x} tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey={spec.y} radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Bar>
        </RBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function PieChart({ spec, data }: { spec: PieChartSpec; data: ChartDataRecord[] }) {
  const slices = useMemo(() => data, [data]);
  const categories = slices.map((s) => String(s[spec.x ?? "category"]))
  const config: ChartConfig = useMemo(() => {
    const entries = categories.map((cat, i) => [cat, { label: cat, color: chartColors[i % chartColors.length] } as const])
    return Object.fromEntries(entries)
  }, [categories]) as ChartConfig
  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RPieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie data={slices} dataKey={spec.y ?? "value"} nameKey={spec.x ?? "category"} innerRadius="20%" outerRadius="80%" paddingAngle={2} labelLine={false}>
            {slices.map((s, i) => (
              <Cell key={i} fill={chartColors[i % chartColors.length]} />
            ))}
          </Pie>
        </RPieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

export function ChartRenderer({ spec, data }: { spec: ChartSpec; data: ChartDataRecord[] }) {
  if (spec.type === "line") return <LineChart spec={spec as LineChartSpec} data={data} />;
  if (spec.type === "bar") return <BarChart spec={spec as BarChartSpec} data={data} />;
  if (spec.type === "pie") return <PieChart spec={spec as PieChartSpec} data={data} />;
  if (spec.type === "table") return <TableChart spec={spec as TableChartSpec} />;
  if (spec.type === "scalar") return <ScalarChart spec={spec as ScalarChartSpec} />;
  if (spec.type === "heatmap") return <HeatMapChart spec={spec as HeatMapChartSpec} />;
  if (spec.type === "stackedBar" || spec.type === "groupBar") return <StackedBarChart spec={spec as StackedBarChartSpec} />;
  if (spec.type === "treemap") return <TreeMapChart spec={spec as TreeMapChartSpec} />;
  return <div>Unsupported chart type: {spec.type}</div>;
}
