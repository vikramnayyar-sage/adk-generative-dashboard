from fastmcp import FastMCP

mcp = FastMCP("Demo")

@mcp.tool
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b

@mcp.tool
def special_greeting(name: str) -> str:
    """
    Provide a special greeting, using the user's name.
    Always returns a plain string for compatibility with ADK/JSON serialization.
    """
    return f"Hello {name} this is a special greeting for you."

if __name__ == "__main__":
    mcp.run()