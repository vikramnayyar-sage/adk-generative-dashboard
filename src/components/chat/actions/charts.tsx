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
      { name: "data", type: "object[]", required: true },
    ],
    handler: ({ type, title, x, y, yFields, valueKey, nameKey, value, columns, format, data }) => {
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
        return "Unsupported chart type";
      }

      const dataRecords: ChartDataRecord[] = Array.isArray(data) ? (data as ChartDataRecord[]) : [];
      const chart: Chart = { ...spec, data: dataRecords };

      setState({
        ...state,
        charts: [...state?.charts || [], chart],
      });

      return { "status": "success", "message": `Added chart "${title}" successfully!` };
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
    handler: ({ currentTitle, type, title, x, y, yFields, valueKey, nameKey, value, columns, format, data }) => {
      const currentCharts = state?.charts || [];
      const chartIndex = currentCharts.findIndex(chart =>
        ('title' in chart ? chart.title : 'Untitled') === currentTitle
      );

      if (chartIndex === -1) {
        return `Chart with title "${currentTitle}" not found. Available charts: ${currentCharts.map(c => 'title' in c ? c.title : 'Untitled').join(', ')}`;
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
        return "Unsupported chart type";
      }

      const newData = Array.isArray(data) ? data : existingChart.data;
      const updatedChart: Chart = { ...spec, data: newData };

      const updatedCharts = [...currentCharts];
      updatedCharts[chartIndex] = updatedChart;
      setState({
        ...state,
        charts: updatedCharts,
      });

      return { "status": "success", "message": `Updated chart "${newTitle}" successfully!` };
    },
  }, [state]);

  // Delete Chart Action
  useCopilotAction({
    name: "delete_chart",
    description: "Delete a chart from the dashboard. Provide the title of the chart to delete.",
    parameters: [
      { name: "title", type: "string", required: true },
    ],
    handler: ({ title }) => {
      const currentCharts = state?.charts || [];
      const chartIndex = currentCharts.findIndex(chart =>
        ('title' in chart ? chart.title : 'Untitled') === title
      );

      if (chartIndex === -1) {
        return `Chart with title "${title}" not found. Available charts: ${currentCharts.map(c => 'title' in c ? c.title : 'Untitled').join(', ')}`;
      }

      const updatedCharts = currentCharts.filter((_, index) => index !== chartIndex);
      setState({
        ...state,
        charts: updatedCharts,
      });

      return { "status": "success", "message": `Deleted chart "${title}" successfully!` };
    },
  }, [state]);
};
