from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Union, Literal
from enum import Enum

# class IconType(str, Enum):
#     users = "users"
#     mrr = "mrr"
#     conversion = "conversion"
#     churn = "churn"
#     custom = "custom"

# A single metric description in the dashboard spec, matching src/lib/types.ts
class Metric(BaseModel):
    """A single metric in the dashboard state, should always have a unique id."""
    id: str
    title: str
    value: str
    hint: Optional[str] = None
    # icon: Optional[IconType] = None


# Flexible record for chart data rows: keys are column names, values are string or number
ChartDataRecord = Dict[str, Union[str, float, int]]
ChartDataMap = Dict[str, List[ChartDataRecord]]

class Chart(BaseModel):
    """A single chart description in the dashboard spec."""
    type: Literal[
        "line", "bar", "pie", "table", "scalar", "heatmap", "stackedBar", "groupBar", "treemap"
    ] = Field(description='Chart type: "line" | "bar" | "pie" | "table" | "scalar" | "heatmap" | "stackedBar" | "groupBar" | "treemap"')
    title: str
    # For line/bar/pie
    x: Optional[str] = None
    y: Optional[str] = None
    data: Optional[List[ChartDataRecord]] = None
    # For table
    columns: Optional[List[str]] = None
    # For scalar
    value: Optional[Union[str, float, int]] = None
    # For heatmap
    matrix: Optional[List[List[float]]] = None
    xLabels: Optional[List[str]] = None
    yLabels: Optional[List[str]] = None
    # For stacked/group bar
    groups: Optional[List[str]] = None
    # For treemap
    nodes: Optional[List[Dict]] = None

class Dashboard(BaseModel):
    """A dashboard spec matching the UI shape."""
    title: str
    pinnedMetrics: List[Metric] = Field(default_factory=list)
    charts: List[Chart] = Field(default_factory=list)
