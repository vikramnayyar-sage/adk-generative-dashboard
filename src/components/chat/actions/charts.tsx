import { useCopilotAction } from "@copilotkit/react-core";
import type {
  AgentState,
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
  Chart,
  ChartDataRecord,
  AgentSetState
} from "@/lib/types";
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
    description: "Add a chart to the dashboard by type. You *must* populate the data, do not create empty charts. Supported types: line, bar, pie, scalar, table, stackedBar, groupedBar, heatmap, tree.",
    parameters: [
      { name: "type", type: "string", required: true },
      { name: "title", type: "string", required: true },
      { name: "x", type: "string", required: false },
      { name: "y", type: "string", required: false },
      { name: "yFields", type: "string[]", required: false },
      { name: "valueKey", type: "string", required: false },
      { name: "nameKey", type: "string", required: false },
      { name: "value", type: "string", required: false },
      { name: "columns", type: "string[]", required: false },
      { name: "format", type: "string", required: false },
      { name: "data", type: "object[]", required: false },
    ],
    renderAndWaitForResponse: ({ args, respond, status }) => {
      const { type, title, x, y, yFields, valueKey, nameKey, value, columns, format, data } = args as {
        type: string;
        title: string;
        x?: string;
        y?: string;
        yFields?: string[];
        valueKey?: string;
        nameKey?: string;
        value?: string;
        columns?: string[];
        format?: string;
        data?: ChartDataRecord[];
      };

      let spec: ChartSpec | null = null;
      if (type === "line") {
        spec = { type: "line", title, x: x ?? "x", y: y ?? "y" } as LineChartSpec;
      } else if (type === "bar") {
        spec = { type: "bar", title, x: x ?? "x", y: y ?? "y" } as BarChartSpec;
      } else if (type === "pie") {
        spec = { type: "pie", title, x: x ?? "category", y: y ?? "value" } as PieChartSpec;
      } else if (type === "scalar") {
        spec = { type: "scalar", title, valueKey: valueKey ?? "value", format } as ScalarChartSpec;
      } else if (type === "table") {
        spec = { type: "table", title, columns: columns ?? [] } as TableChartSpec;
      } else if (type === "stackedBar") {
        spec = { type: "stackedBar", title, x: x ?? "x", y: yFields ?? [] } as StackedBarChartSpec;
      } else if (type === "groupedBar") {
        spec = { type: "groupedBar", title, x: x ?? "x", y: yFields ?? [] } as GroupedBarChartSpec;
      } else if (type === "heatmap") {
        spec = { type: "heatmap", title, x: x ?? "x", y: y ?? "y", value: value ?? "value" } as HeatmapChartSpec;
      } else if (type === "tree") {
        spec = { type: "tree", title, nameKey: nameKey ?? "name", valueKey: valueKey ?? "value" } as TreeChartSpec;
      }

      if (!spec) {
        respond?.("Unsupported chart type");
        return <></>;
      }

      const dataRecords: ChartDataRecord[] = Array.isArray(data) ? (data as ChartDataRecord[]) : [];
      const chart: Chart = { ...spec, data: dataRecords };

      const onHumanResponse = (shouldProceed: boolean) => {
        if (!shouldProceed) {
          respond?.("User declined adding the chart. This is not an issuue, they just don't want to add it.");
          return;
        }
        setState({
          ...state,
          charts: [...state?.charts || [], chart],
        });
        respond?.({ "status": "success", "message": "Added chart successfully!" });
      }

      return (
        <ChartCard
          spec={spec}
          onHumanInput={onHumanResponse}
          status={status}
          chartData={{[title]: dataRecords }}
        />
      );
    },
  }, [state]);

  // Update Chart Action
  useCopilotAction({
    name: "update_chart",
    description: "Update an existing chart on the dashboard. Provide the current title to identify which chart to update. Supported types: line, bar, pie, scalar, table, stackedBar, groupedBar, heatmap, tree.",
    parameters: [
      { name: "currentTitle", type: "string", required: true },
      { name: "type", type: "string", required: false },
      { name: "title", type: "string", required: false },
      { name: "x", type: "string", required: false },
      { name: "y", type: "string", required: false },
      { name: "yFields", type: "string[]", required: false },
      { name: "valueKey", type: "string", required: false },
      { name: "nameKey", type: "string", required: false },
      { name: "value", type: "string", required: false },
      { name: "columns", type: "string[]", required: false },
      { name: "format", type: "string", required: false },
      { name: "data", type: "object[]", required: false },
    ],
    renderAndWaitForResponse: ({ args, respond, status }) => {
      const { currentTitle, type, title, x, y, yFields, valueKey, nameKey, value, columns, format, data } = args as {
        currentTitle: string;
        type?: string;
        title?: string;
        x?: string;
        y?: string;
        yFields?: string[];
        valueKey?: string;
        nameKey?: string;
        value?: string;
        columns?: string[];
        format?: string;
        data?: ChartDataRecord[];
      };

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
      if (newType === "line") {
        spec = {
          type: "line",
          title: newTitle,
          x: x ?? ('x' in existingChart ? existingChart.x : "x"),
          y: y ?? ('y' in existingChart && typeof existingChart.y === 'string' ? existingChart.y : "y")
        } as LineChartSpec;
      } else if (newType === "bar") {
        spec = {
          type: "bar",
          title: newTitle,
          x: x ?? ('x' in existingChart ? existingChart.x : "x"),
          y: y ?? ('y' in existingChart && typeof existingChart.y === 'string' ? existingChart.y : "y")
        } as BarChartSpec;
      } else if (newType === "pie") {
        spec = {
          type: "pie",
          title: newTitle,
          x: x ?? ('x' in existingChart ? existingChart.x : "category"),
          y: y ?? ('y' in existingChart && typeof existingChart.y === 'string' ? existingChart.y : "value")
        } as PieChartSpec;
      } else if (newType === "scalar") {
        spec = {
          type: "scalar",
          title: newTitle,
          valueKey: valueKey ?? ('valueKey' in existingChart ? existingChart.valueKey : "value"),
          format: format ?? ('format' in existingChart ? existingChart.format : undefined)
        } as ScalarChartSpec;
      } else if (newType === "table") {
        spec = {
          type: "table",
          title: newTitle,
          columns: columns ?? ('columns' in existingChart ? existingChart.columns : [])
        } as TableChartSpec;
      } else if (newType === "stackedBar") {
        spec = {
          type: "stackedBar",
          title: newTitle,
          x: x ?? ('x' in existingChart ? existingChart.x : "x"),
          y: yFields ?? ('y' in existingChart && Array.isArray(existingChart.y) ? existingChart.y : [])
        } as StackedBarChartSpec;
      } else if (newType === "groupedBar") {
        spec = {
          type: "groupedBar",
          title: newTitle,
          x: x ?? ('x' in existingChart ? existingChart.x : "x"),
          y: yFields ?? ('y' in existingChart && Array.isArray(existingChart.y) ? existingChart.y : [])
        } as GroupedBarChartSpec;
      } else if (newType === "heatmap") {
        spec = {
          type: "heatmap",
          title: newTitle,
          x: x ?? ('x' in existingChart ? existingChart.x : "x"),
          y: y ?? ('y' in existingChart && typeof existingChart.y === 'string' ? existingChart.y : "y"),
          value: value ?? ('value' in existingChart ? existingChart.value : "value")
        } as HeatmapChartSpec;
      } else if (newType === "tree") {
        spec = {
          type: "tree",
          title: newTitle,
          nameKey: nameKey ?? ('nameKey' in existingChart ? existingChart.nameKey : "name"),
          valueKey: valueKey ?? ('valueKey' in existingChart ? existingChart.valueKey : "value")
        } as TreeChartSpec;
      }

      if (!spec) {
        respond?.("Unsupported chart type");
        return <></>;
      }

      const newData = Array.isArray(data) ? data : existingChart.data;
      const updatedChart: Chart = { ...spec, data: newData };

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
      }

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
            chartData={{[newTitle]: newData }}
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
                chartData={{[title]: chartToDelete.data }}
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
