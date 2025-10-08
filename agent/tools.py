# ADK imports
import os
from google.adk.tools import ToolContext, FunctionTool
from typing import List, Dict

# Local imports
from state import Metric

def add_pinned_metrics(tool_context: ToolContext, new_pinned_metrics: List[Metric]) -> Dict[str, str]:
    """
    Add a list of new metrics to the dashboard.

    Make sure the metrics all have a unique id.
    """
    try:
        current_metrics = tool_context.state.get("pinnedMetrics", [])
        tool_context.state["pinnedMetrics"] = current_metrics + new_pinned_metrics
        return {"status": "success", "message": "Pinned metrics set successfully"}

    except Exception as e:
        return {"status": "error", "message": f"Error updating pinned metrics: {str(e)}"}

def update_pinned_metrics(tool_context: ToolContext, updated_pinned_metrics: List[Metric]) -> Dict[str, str]:
    """
    Update a list of new metrics to the dashboard. Use for updates and removals. You must include the previously
    pinned metrics in the list, the end result of this will be the complete list of pinned metrics.
    """
    try:
        tool_context.state["pinnedMetrics"] = updated_pinned_metrics
        return {"status": "success", "message": "Pinned metrics set successfully"}
    except Exception as e:
        return {"status": "error", "message": f"Error updating pinned metrics: {str(e)}"}


# Chart tools removed - these are now handled by frontend useCopilotAction hooks
# The frontend actions will be automatically exposed to the agent via CopilotKit

tools = [
    FunctionTool(func=add_pinned_metrics),
    FunctionTool(func=update_pinned_metrics),
]
