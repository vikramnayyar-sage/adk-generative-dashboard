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
        "line",
        "bar",
        "pie",
        "stackedBar",
        "groupedBar",
        "scalar",
        "table",
        "heatmap",
        "tree"
    ] = Field(description='Chart type: "line" | "bar" | "pie" | "stackedBar" | "groupedBar" | "scalar" | "table" | "heatmap" | "tree"')
    title: str
    # Common fields
    x: Optional[str] = None
    y: Optional[str] = None
    # stackedBar/groupedBar: yFields is array of value fields
    yFields: Optional[List[str]] = None
    # scalar: valueKey, format
    valueKey: Optional[str] = None
    format: Optional[str] = None
    # table: columns
    columns: Optional[List[str]] = None
    # heatmap: value
    value: Optional[str] = None
    # tree: nameKey, valueKey
    nameKey: Optional[str] = None
    # Data for all chart types
    data: List[ChartDataRecord] = Field(default_factory=list)


# Cashflow entry matching MOCK.json
class CashflowEntry(BaseModel):
    date: str
    type: Literal["incoming", "outgoing"]
    amount: float
    party: str
    category: str
    status: str
    balance_after: float
    event_flags: List[str] = Field(default_factory=list)

class Dashboard(BaseModel):
    """A dashboard spec matching the UI shape."""
    title: str
    pinnedMetrics: List[Metric] = Field(default_factory=list)
    charts: List[Chart] = Field(default_factory=list)
    cashflowEntries: List[CashflowEntry] = Field(default_factory=list)
