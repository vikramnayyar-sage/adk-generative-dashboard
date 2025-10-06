import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart as RBarChart,
  Bar,
  PieChart as RPieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ChartSpec, LineChartSpec, BarChartSpec, PieChartSpec, ChartDataRecord } from "@/lib/types";


interface ChartRendererProps {
  spec: ChartSpec;
  data: ChartDataRecord[];
}

export function ChartRenderer({ spec, data }: ChartRendererProps) {
  if (spec.type === "line") return <LineChart spec={spec as LineChartSpec} data={data} />;
  if (spec.type === "bar") return <BarChart spec={spec as BarChartSpec} data={data} />;
  return <PieChart spec={spec as PieChartSpec} data={data} />;
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
