from fastmcp import FastMCP
import mailtrap as mt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import http.client
import json
import os
from dotenv import load_dotenv

load_dotenv()

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

@mcp.tool
def send_email(email_address, subject, text):
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    sender_email = "vikram.nayyar.sage@gmail.com"
    app_password = "jbie gwoo fxmh puxj"  # Replace with your Gmail App Password

    # Create email
    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = email_address
    msg["Subject"] = subject
    msg.attach(MIMEText(text, "plain"))

    # Send via Gmail SMTP
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, app_password)
        server.send_message(msg)

    print(f"Email sent to {email_address}")
    

# New MCP tool: send SMS via Infobip https://portal.infobip.com/onboarding-guide
@mcp.tool
def send_sms_infobip(text: str, to_number: str = None) -> str:
    """
    Send an SMS using Infobip API. Loads API key and test phone number from environment.
    Args:
        text: Message text to send.
        to_number: Destination phone number. If not provided, uses TEST_PHONE_NUMBER from env.
    Returns:
        API response as string.
    """
    api_key = os.environ.get("INFOBIP_API_KEY")
    test_number = os.environ.get("TEST_PHONE_NUMBER")
    if not api_key:
        return "ERROR: INFOBIP_API_KEY not set in environment."
    if not to_number:
        if not test_number:
            return "ERROR: TEST_PHONE_NUMBER not set in environment."
        to_number = test_number
    conn = http.client.HTTPSConnection("api.infobip.com")
    payload = json.dumps({
        "messages": [
            {
                "destinations": [{"to": to_number}],
                "from": "447491163443", #Came from Docs.
                "text": text
            }
        ]
    })
    headers = {
        'Authorization': f"App {api_key}",
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    conn.request("POST", "/sms/2/text/advanced", payload, headers)
    res = conn.getresponse()
    data = res.read()
    return data.decode("utf-8")
    
    




if __name__ == "__main__":
    mcp.run()
