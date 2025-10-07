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
    type: Literal["line", "bar", "pie"] = Field(description='Chart type: "line" | "bar" | "pie"')
    title: str
    x: Optional[str] = None
    y: Optional[str] = None
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
