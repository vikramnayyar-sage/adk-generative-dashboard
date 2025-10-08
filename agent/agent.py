from __future__ import annotations

# ADK imports
from ag_ui_adk import ADKAgent
from google.adk.agents import Agent
from google.adk.agents.callback_context import CallbackContext
from google.adk.tools import google_search, FunctionTool
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools.mcp_tool.mcp_toolset import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import SseConnectionParams, StdioConnectionParams, StdioServerParameters
from fastmcp import FastMCP



# Local imports
from modifiers import before_model, after_model
from tools import tools
from instructions import instruction_provider



import os
import json
from state import Dashboard, CashflowEntry

def load_mock_data():
  mock_path = os.path.join(os.path.dirname(__file__), '..', 'DATA', 'MOCK.json')
  try:
    with open(mock_path, 'r') as f:
      data = json.load(f)
    # Convert dicts to CashflowEntry objects
    return [CashflowEntry(**entry) for entry in data]
  except Exception as e:
    print(f"Error loading MOCK.json: {e}")
    return []

def on_before_agent(callback_context: CallbackContext):
  """
  Initialize dashboard state if it doesn't exist, and inject mock data.
  """
  state = callback_context.state
  if state is not None and 'cashflowEntries' in state:
    return None
  mock_entries = load_mock_data()
  # If state is None, initialize as Dashboard
  if state is None:
    callback_context.state = Dashboard(
      title="Demo Dashboard",
      pinnedMetrics=[],
      charts=[],
      cashflowEntries=mock_entries
    ).dict()
  else:
    callback_context.state['cashflowEntries'] = [entry.dict() for entry in mock_entries]
  return None

mcp_toolset = McpToolset(
    connection_params=StdioConnectionParams(
        server_params=StdioServerParameters(
            command="fastmcp",
            args=["run", "main.py:mcp"],
            cwd="c:/Dev/hackathon-prep/adk-generative-dashboard/agent/mcp",
        )
    )
)

print(f"TOOLS:")
print(tools)
print(f"MCP TOOLSET:")
print(mcp_toolset)

search_agent = Agent(
  model='gemini-2.0-flash',
  name='SearchAgent',
  instruction="""
  You're a specialist in Google Search
  """,
  tools=[
    google_search,
    mcp_toolset #FROM TEST MCP Server.
  ],
)

print(f"TOOLS:")
print(tools)
print(f"MCP TOOLSET:")
print(mcp_toolset)



search_agent = Agent(
  model='gemini-2.0-flash',
  name='SearchAgent',
  instruction="""
  You're a specialist in Google Search
  """,
  tools=[
    google_search,
    mcp_toolset #FROM TEST MCP Server.
  
  ],
)


dashboard_agent = Agent(
  name="DashboardAgent",
  model="gemini-2.5-flash",
  tools=tools + [AgentTool(agent=search_agent), mcp_toolset],

  # run-loop modifiers
  before_agent_callback=on_before_agent,
  before_model_callback=before_model,
  after_model_callback = after_model,

  # system instructions
  instruction=instruction_provider,
)

# Create ADK middleware agent instance
dashboard_agent = ADKAgent(
  adk_agent=dashboard_agent,
  app_name="dashboard_app",
  user_id="demo_user",
  session_timeout_seconds=3600,
  use_in_memory_services=True
)
