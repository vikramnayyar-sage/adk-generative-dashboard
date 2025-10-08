import {
  BarChart3,
  ChartLine,
  PieChart as PieChartIcon,
  LayoutDashboard,
  Hash,
  Table as TableIcon,
  BarChart4,
  Grid3x3,
  TreeDeciduous
} from "lucide-react";
import type { ChartSpec } from "@/lib/types";

export function ChartTypeIcon({ spec }: { spec: ChartSpec }) {
  if (spec.type === "line") return <ChartLine className="size-4" />;
  if (spec.type === "bar") return <BarChart3 className="size-4" />;
  if (spec.type === "pie") return <PieChartIcon className="size-4" />;
  if (spec.type === "scalar") return <Hash className="size-4" />;
  if (spec.type === "table") return <TableIcon className="size-4" />;
  if (spec.type === "stackedBar") return <BarChart4 className="size-4" />;
  if (spec.type === "groupedBar") return <BarChart3 className="size-4" />;
  if (spec.type === "heatmap") return <Grid3x3 className="size-4" />;
  if (spec.type === "tree") return <TreeDeciduous className="size-4" />;
  return <LayoutDashboard className="size-4" />;
}
