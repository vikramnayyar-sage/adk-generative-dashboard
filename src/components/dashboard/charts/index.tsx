
export { ChartCard } from "./chart-card";
export { ChartGrid } from "./chart-grid";
import React from "react";
import {
	ResponsiveContainer,
	BarChart as RBarChart,
	Bar,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	PieChart as RPieChart,
	Pie,
	Cell,
	Treemap,
} from "recharts";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type {
	StackedBarChartSpec,
	GroupedBarChartSpec,
	ScalarChartSpec,
	TableChartSpec,
	HeatmapChartSpec,
	TreeChartSpec,
	ChartDataRecord,
} from "@/lib/types";


const chartColors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function PieChart({ spec, data }: { spec: PieChartSpec; data: ChartDataRecord[] }) {
	const slices = data;
	const categories = slices.map((s) => String(s[spec.x ?? "category"]));
	return (
		<ResponsiveContainer width="100%" height={250}>
			<RPieChart>
				<Pie
					data={slices}
					dataKey={spec.y ?? "value"}
					nameKey={spec.x ?? "category"}
					cx="50%"
					cy="50%"
					outerRadius={80}
					label
				>
					{slices.map((entry, idx) => (
						<Cell key={`cell-${idx}`} fill={chartColors[idx % chartColors.length]} />
					))}
				</Pie>
				<Tooltip />
				<Legend />
			</RPieChart>
		</ResponsiveContainer>
	);
}

export function StackedBarChart({ spec, data }: { spec: StackedBarChartSpec; data: ChartDataRecord[] }) {
	return (
		<ResponsiveContainer width="100%" height={250}>
			<RBarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 12 }}>
				<CartesianGrid vertical={false} />
				<XAxis dataKey={spec.x} tickLine={false} axisLine={false} tickMargin={8} />
				<YAxis tickLine={false} axisLine={false} tickMargin={8} />
				<Tooltip />
				<Legend />
				{spec.y.map((yKey, idx) => (
					<Bar key={yKey} dataKey={yKey} stackId="a" fill={chartColors[idx % chartColors.length]} radius={[4, 4, 0, 0]} />
				))}
			</RBarChart>
		</ResponsiveContainer>
	);
}

export function GroupedBarChart({ spec, data }: { spec: GroupedBarChartSpec; data: ChartDataRecord[] }) {
	return (
		<ResponsiveContainer width="100%" height={250}>
			<RBarChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: 12 }}>
				<CartesianGrid vertical={false} />
				<XAxis dataKey={spec.x} tickLine={false} axisLine={false} tickMargin={8} />
				<YAxis tickLine={false} axisLine={false} tickMargin={8} />
				<Tooltip />
				<Legend />
				{spec.y.map((yKey, idx) => (
					<Bar key={yKey} dataKey={yKey} fill={chartColors[idx % chartColors.length]} radius={[4, 4, 0, 0]} />
				))}
			</RBarChart>
		</ResponsiveContainer>
	);
}

export function ScalarChart({ spec, data }: { spec: ScalarChartSpec; data: ChartDataRecord[] }) {
	const value = data?.[0]?.[spec.valueKey] ?? "-";
	return (
		<div className="flex flex-col items-center justify-center h-[120px]">
			<span className="text-3xl font-bold">{spec.format === "currency" ? `£${value}` : value}</span>
			<span className="text-muted-foreground text-sm mt-2">{spec.title}</span>
		</div>
	);
}

export function TableChart({ spec, data }: { spec: TableChartSpec; data: ChartDataRecord[] }) {
	return (
		<Table className="w-full text-xs">
			<TableHeader>
				<TableRow>
					{spec.columns.map((col) => (
						<TableHead key={col}>{col}</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((row, i) => (
					<TableRow key={i}>
						{spec.columns.map((col) => (
							<TableCell key={col}>{row[col]}</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export function HeatmapChart({ spec, data }: { spec: HeatmapChartSpec; data: ChartDataRecord[] }) {
	// Simple grid heatmap using divs (for demo purposes)
	const xVals = Array.from(new Set(data.map((d) => d[spec.x])));
	const yVals = Array.from(new Set(data.map((d) => d[spec.y])));
	const getColor = (v: number) => {
		// Map value to color (red for high, blue for low)
		const min = Math.min(...data.map((d) => Number(d[spec.value])));
		const max = Math.max(...data.map((d) => Number(d[spec.value])));
		const pct = (Number(v) - min) / (max - min || 1);
		return `rgba(${255 * pct},${64 + 128 * (1 - pct)},${255 * (1 - pct)},0.7)`;
	};
	return (
		<div className="overflow-auto">
			<table className="border-collapse w-full text-xs">
				<thead>
					<tr>
						<th></th>
						{xVals.map((x) => <th key={x}>{x}</th>)}
					</tr>
				</thead>
				<tbody>
					{yVals.map((y) => (
						<tr key={y}>
							<td className="font-bold">{y}</td>
							{xVals.map((x) => {
								const cell = data.find((d) => d[spec.x] === x && d[spec.y] === y);
								const v = cell ? Number(cell[spec.value]) : 0;
								return <td key={x} style={{ background: getColor(v), minWidth: 32 }}>{v}</td>;
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export function TreeChart({ spec, data }: { spec: TreeChartSpec; data: ChartDataRecord[] }) {
	// Use recharts Treemap for hierarchical data
	// Data must be in [{ name, value, children: [...] }] format
	// For demo, flatten to single level
	const treeData = data.map((d) => ({
		name: d[spec.nameKey],
		value: Number(d[spec.valueKey]),
	}));
	return (
		<ResponsiveContainer width="100%" height={250}>
			<Treemap
				data={treeData}
				dataKey="value"
				nameKey="name"
				aspectRatio={1}
				stroke="#fff"
				fill="#8884d8"
			/>
		</ResponsiveContainer>
	);
}
export { CashflowIntelligenceChart } from "./CashflowIntelligenceChart";

