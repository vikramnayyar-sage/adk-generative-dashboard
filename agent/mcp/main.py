from fastmcp import FastMCP
import mailtrap as mt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

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



if __name__ == "__main__":
    mcp.run()