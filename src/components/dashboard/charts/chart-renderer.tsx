import React, { useMemo } from "react";
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
  Treemap,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  ChartSpec,
  LineChartSpec,
  BarChartSpec,
  PieChartSpec,
  ScalarChartSpec,
  TableChartSpec,
  StackedBarChartSpec,
  GroupedBarChartSpec,
  HeatmapChartSpec,
  TreeChartSpec,
  ChartDataRecord
} from "@/lib/types";

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

export function ChartRenderer({ spec, data }: ChartRendererProps) {
  if (spec.type === "line") return <LineChart spec={spec as LineChartSpec} data={data} />;
  if (spec.type === "bar") return <BarChart spec={spec as BarChartSpec} data={data} />;
  if (spec.type === "pie") return <PieChart spec={spec as PieChartSpec} data={data} />;
  if (spec.type === "scalar") return <ScalarChart spec={spec as ScalarChartSpec} data={data} />;
  if (spec.type === "table") return <TableChart spec={spec as TableChartSpec} data={data} />;
  if (spec.type === "stackedBar") return <StackedBarChart spec={spec as StackedBarChartSpec} data={data} />;
  if (spec.type === "groupedBar") return <GroupedBarChart spec={spec as GroupedBarChartSpec} data={data} />;
  if (spec.type === "heatmap") return <HeatmapChart spec={spec as HeatmapChartSpec} data={data} />;
  if (spec.type === "tree") return <TreeChart spec={spec as TreeChartSpec} data={data} />;
  return <div className="text-muted-foreground text-sm">Unsupported chart type</div>;
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

function ScalarChart({ spec, data }: { spec: ScalarChartSpec; data: ChartDataRecord[] }) {
  const value = data[0]?.[spec.valueKey] ?? "N/A";
  const formatted = spec.format === "currency" && typeof value === "number"
    ? `$${value.toLocaleString()}`
    : String(value);

  return (
    <div className="flex items-center justify-center h-[250px] w-full">
      <div className="text-center">
        <div className="text-5xl font-bold text-foreground">{formatted}</div>
        {spec.title && <div className="text-sm text-muted-foreground mt-2">{spec.title}</div>}
      </div>
    </div>
  );
}

function TableChart({ spec, data }: { spec: TableChartSpec; data: ChartDataRecord[] }) {
  const columns = spec.columns && spec.columns.length > 0
    ? spec.columns
    : Object.keys(data[0] ?? {});

  return (
    <div className="w-full max-h-[250px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={col}>{String(row[col] ?? "")}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StackedBarChart({ spec, data }: { spec: StackedBarChartSpec; data: ChartDataRecord[] }) {
  const config: ChartConfig = useMemo(() => {
    const entries = spec.y.map((field, i) => [field, { label: field, color: chartColors[i % chartColors.length] }] as const);
    return Object.fromEntries(entries);
  }, [spec.y]) as ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={spec.x} tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {spec.y.map((field, i) => (
            <Bar key={field} dataKey={field} stackId="stack" fill={chartColors[i % chartColors.length]} radius={i === spec.y.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function GroupedBarChart({ spec, data }: { spec: GroupedBarChartSpec; data: ChartDataRecord[] }) {
  const config: ChartConfig = useMemo(() => {
    const entries = spec.y.map((field, i) => [field, { label: field, color: chartColors[i % chartColors.length] }] as const);
    return Object.fromEntries(entries);
  }, [spec.y]) as ChartConfig;

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RBarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={spec.x} tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {spec.y.map((field, i) => (
            <Bar key={field} dataKey={field} fill={chartColors[i % chartColors.length]} radius={[4, 4, 0, 0]} />
          ))}
        </RBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

function HeatmapChart({ spec, data }: { spec: HeatmapChartSpec; data: ChartDataRecord[] }) {
  const xValues = Array.from(new Set(data.map((d) => String(d[spec.x]))));
  const yValues = Array.from(new Set(data.map((d) => String(d[spec.y]))));

  const maxValue = Math.max(...data.map((d) => Number(d[spec.value]) || 0));
  const minValue = Math.min(...data.map((d) => Number(d[spec.value]) || 0));

  const getColor = (value: number) => {
    const normalized = maxValue === minValue ? 0.5 : (value - minValue) / (maxValue - minValue);
    const hue = 220 - normalized * 60; // Blue to purple
    const lightness = 90 - normalized * 40; // Light to dark
    return `hsl(${hue}, 70%, ${lightness}%)`;
  };

  return (
    <div className="w-full h-[250px] overflow-auto">
      <div className="inline-grid gap-1 p-2" style={{ gridTemplateColumns: `auto repeat(${xValues.length}, 1fr)` }}>
        <div />
        {xValues.map((x) => (
          <div key={x} className="text-xs text-center font-medium">{x}</div>
        ))}
        {yValues.map((y) => (
          <React.Fragment key={y}>
            <div className="text-xs font-medium pr-2 flex items-center">{y}</div>
            {xValues.map((x) => {
              const cell = data.find((d) => String(d[spec.x]) === x && String(d[spec.y]) === y);
              const value = Number(cell?.[spec.value]) || 0;
              return (
                <div
                  key={`${x}-${y}`}
                  className="w-12 h-12 flex items-center justify-center text-xs rounded"
                  style={{ backgroundColor: getColor(value) }}
                  title={`${x}, ${y}: ${value}`}
                >
                  {value}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function TreeChart({ spec, data }: { spec: TreeChartSpec; data: ChartDataRecord[] }) {
  const treeData = data.map((d) => ({
    name: String(d[spec.nameKey]),
    size: Number(d[spec.valueKey]) || 0,
  }));

  const config: ChartConfig = useMemo(() => ({}), []);

  return (
    <ChartContainer config={config} className="aspect-auto h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={treeData}
          dataKey="size"
          stroke="#fff"
          fill="var(--chart-1)"
        >
          <ChartTooltip content={<ChartTooltipContent />} />
        </Treemap>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
