import { useCopilotAction } from "@copilotkit/react-core";
import type { AgentState, ChartSpec, Chart, ChartDataRecord, AgentSetState } from "@/lib/types";

type TreemapNode = { label: string; value: number; children?: TreemapNode[] };

type ChartActionArgs = {
  type?: string;
  title?: string;
  x?: string;
  y?: string;
  data?: ChartDataRecord[];
  columns?: string[];
  value?: number;
  matrix?: number[][];
  xLabels?: string[];
  yLabels?: string[];
  groups?: string[];
  nodes?: TreemapNode[];
  currentTitle?: string;
};
import { ChartCard } from "@/components/dashboard/charts";
import { Button } from "@/components/ui/button";

interface UseChartActionsProps {
  state: AgentState;
  setState: AgentSetState<AgentState>;
}

export const useChartActions = ({ state, setState }: UseChartActionsProps) => {
  // Add Chart Action
  useCopilotAction({
    name: "add_chart",
    description: "Add a chart to the dashboard by type. You *must* populate the data, do not create empty charts.",
    parameters: [
      { name: "type", type: "string", required: true },
      { name: "title", type: "string", required: true },
      { name: "x", type: "string", required: false },
      { name: "y", type: "string", required: false },
      { name: "data", type: "object[]", required: false },
      { name: "columns", type: "string[]", required: false },
      { name: "value", type: "number", required: false },
  { name: "matrix", type: "object[]", required: false },
      { name: "xLabels", type: "string[]", required: false },
      { name: "yLabels", type: "string[]", required: false },
      { name: "groups", type: "string[]", required: false },
      { name: "nodes", type: "object[]", required: false }
    ],
    renderAndWaitForResponse: ({ args, respond, status }) => {
      const {
        type = "line",
        title = "Untitled",
        x,
        y,
        data,
        columns,
        value,
        matrix,
        xLabels,
        yLabels,
        groups,
        nodes
      } = args as ChartActionArgs;
      let spec: ChartSpec | null = null;
      let chartData: ChartDataRecord[] = Array.isArray(data) ? data : [];
      if (type === "line") {
        spec = { type: "line", title, x: x ?? "x", y: y ?? "y" };
      } else if (type === "bar") {
        spec = { type: "bar", title, x: x ?? "x", y: y ?? "y" };
      } else if (type === "pie") {
        spec = { type: "pie", title, x: x ?? "category", y: y ?? "value" };
      } else if (type === "table") {
        spec = { type: "table", title, columns: columns ?? [], data: chartData };
      } else if (type === "scalar") {
        spec = { type: "scalar", title, value: value ?? 0 };
        chartData = [];
      } else if (type === "heatmap") {
        spec = { type: "heatmap", title, matrix: matrix ?? [], xLabels: xLabels ?? [], yLabels: yLabels ?? [] };
        chartData = [];
      } else if (type === "stackedBar" || type === "groupBar") {
        spec = { type, title, x: x ?? "x", groups: groups ?? [], data: chartData };
      } else if (type === "treemap") {
  spec = { type: "treemap", title, nodes: Array.isArray(nodes) ? (nodes as TreemapNode[]) : [] };
        chartData = [];
      }
      if (!spec) {
        respond?.("Unsupported chart type");
        return <></>;
      }
      const chart: Chart = spec as Chart;
      const onHumanResponse = (shouldProceed: boolean) => {
        if (!shouldProceed) {
          respond?.("User declined adding the chart. This is not an issue, they just don't want to add it.");
          return;
        }
        setState({
          ...state,
          charts: [...(state?.charts || []), chart],
        });
        respond?.({ "status": "success", "message": "Added chart successfully!" });
      };
      return (
        <ChartCard
          spec={spec ?? { type: "line", title: "Untitled" }}
          onHumanInput={onHumanResponse}
          status={status}
          chartData={{ [title]: chartData }}
        />
      );
    },
  }, [state]);

  // Update Chart Action
  useCopilotAction({
    name: "update_chart",
    description: "Update an existing chart on the dashboard. Provide the current title to identify which chart to update.",
    parameters: [
      { name: "currentTitle", type: "string", required: true },
      { name: "type", type: "string", required: false },
      { name: "title", type: "string", required: false },
      { name: "x", type: "string", required: false },
      { name: "y", type: "string", required: false },
      { name: "data", type: "object[]", required: false },
      { name: "columns", type: "string[]", required: false },
      { name: "value", type: "number", required: false },
      { name: "matrix", type: "object[]", required: false },
      { name: "xLabels", type: "string[]", required: false },
      { name: "yLabels", type: "string[]", required: false },
      { name: "groups", type: "string[]", required: false },
      { name: "nodes", type: "object[]", required: false }
    ],
  renderAndWaitForResponse: ({ args, respond, status }) => {
  const currentTitle = args.currentTitle ?? "Untitled";
  const { type = "line", title = "Untitled", x, y, data, value } = args;

      const currentCharts = state?.charts || [];
      const chartIndex = currentCharts.findIndex(chart => 
        ('title' in chart ? chart.title : 'Untitled') === currentTitle
      );

      if (chartIndex === -1) {
        respond?.(`Chart with title "${currentTitle}" not found. Available charts: ${currentCharts.map(c => 'title' in c ? c.title : 'Untitled').join(', ')}`);
        return <></>;
      }

      const existingChart = currentCharts[chartIndex];
      const newType = type || existingChart.type;
      const newTitle = title || ('title' in existingChart ? existingChart.title : 'Untitled');

      let spec: ChartSpec | null = null;
      let chartData: ChartDataRecord[] = [];
      if (newType === "line") {
        spec = { type: "line", title: newTitle, x: x ?? ('x' in existingChart ? existingChart.x : "x"), y: y ?? ('y' in existingChart ? existingChart.y : "y") };
        chartData = Array.isArray(data) ? data : [];
      } else if (newType === "bar") {
        spec = { type: "bar", title: newTitle, x: x ?? ('x' in existingChart ? existingChart.x : "x"), y: y ?? ('y' in existingChart ? existingChart.y : "y") };
        chartData = Array.isArray(data) ? data : [];
      } else if (newType === "pie") {
        spec = { type: "pie", title: newTitle, x: x ?? ('x' in existingChart ? existingChart.x : "category"), y: y ?? ('y' in existingChart ? existingChart.y : "value") };
        chartData = Array.isArray(data) ? data : [];
      } else if (newType === "table") {
        spec = { type: "table", title: newTitle, columns: args.columns ?? [], data: Array.isArray(data) ? data : [] };
        chartData = Array.isArray(data) ? data : [];
      } else if (newType === "scalar") {
  spec = { type: "scalar", title: newTitle, value: value ?? 0 };
        chartData = [];
      } else if (newType === "heatmap") {
        spec = { type: "heatmap", title: newTitle, matrix: args.matrix ?? [], xLabels: args.xLabels ?? [], yLabels: args.yLabels ?? [] };
        chartData = [];
      } else if (newType === "stackedBar" || newType === "groupBar") {
        spec = { type: newType, title: newTitle, x: x ?? ('x' in existingChart ? existingChart.x : "x"), groups: args.groups ?? [], data: Array.isArray(data) ? data : [] };
        chartData = Array.isArray(data) ? data : [];
      } else if (newType === "treemap") {
    spec = { type: "treemap", title: newTitle, nodes: Array.isArray(args.nodes) ? (args.nodes as TreemapNode[]) : [] };
        chartData = [];
      }
      if (!spec) {
        respond?.("Unsupported chart type");
        return <></>;
      }
      const updatedChart: Chart = spec as Chart;
      const onHumanResponse = (shouldProceed: boolean) => {
        if (!shouldProceed) {
          respond?.({ "status": "success", "message": "User declined updating the chart." });
          return;
        }
        const updatedCharts = [...currentCharts];
        updatedCharts[chartIndex] = updatedChart;
        setState({
          ...state,
          charts: updatedCharts,
        });
        respond?.({ "status": "success", "message": "Updated chart successfully!" });
      };
      return (
        <>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              Updating chart: <strong>{currentTitle}</strong>
            </p>
          </div>
          <ChartCard
            spec={spec}
            onHumanInput={onHumanResponse}
            status={status}
            chartData={{[newTitle]: chartData }}
            actionButtonText="Update"
          />
        </>
      );
    },
  }, [state]);

  // Delete Chart Action
  useCopilotAction({
    name: "delete_chart",
    description: "Delete a chart from the dashboard. Provide the title of the chart to delete.",
    parameters: [
      { name: "title", type: "string", required: true },
    ],
    renderAndWaitForResponse: ({ args, respond, status }) => {
      const { title } = args as { title: string };

      const currentCharts = state?.charts || [];
      const chartIndex = currentCharts.findIndex(chart => 
        ('title' in chart ? chart.title : 'Untitled') === title
      );

      if (chartIndex === -1) {
        respond?.(`Chart with title "${title}" not found. Available charts: ${currentCharts.map(c => 'title' in c ? c.title : 'Untitled').join(', ')}`);
        return <></>;
      }

      const chartToDelete = currentCharts[chartIndex];

      if (!chartToDelete) {
        return <></>;
      }

      const onHumanResponse = (shouldProceed: boolean) => {
        if (!shouldProceed) {
          respond?.({ "status": "success", "message": "User declined deleting the chart." });
          return;
        }
        const updatedCharts = currentCharts.filter((_, index) => index !== chartIndex);
        setState({
          ...state,
          charts: updatedCharts,
        });
        respond?.({ "status": "success", "message": "Deleted chart successfully!" });
      }

      return (
        <div className="space-y-4">
          <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
            <h3 className="font-medium text-destructive mb-2">Delete Chart</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Are you sure you want to delete the chart: <strong>{title}</strong>?
            </p>
            <div className="border border-border rounded-lg p-3 bg-background">
              <ChartCard
                spec={chartToDelete}
                chartData={{[title]: 'data' in chartToDelete ? chartToDelete.data ?? [] : [] }}
              />
            </div>
          </div>
          {status !== "complete" && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onHumanResponse(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => onHumanResponse(true)}>Delete</Button>
            </div>
          )}
        </div>
      );
    },
  }, [state]);
};
