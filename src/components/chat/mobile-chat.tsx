"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";
import { SidebarInput } from "@/components/chat/layout/input";
import { AssistantBubble } from "@/components/chat/layout/assistant-message";
import { UserBubble } from "@/components/chat/layout/user-message";
import { Suggestions } from "@/components/chat/layout/suggestion";

export function MobileChat() {
  return (
    <CopilotSidebar
      labels={{
        title: "🪁 ADK Dashboard Agent",
        initial: "👋 Hi! I'll help you analyze your cashflow and build visualizations."
      }}
      suggestions={[
        // Old suggestions - commented out
        // { title: "Pizza sales", message: "Please update the dashboard to help me keep track of the current trends in the Pizza industry." },
        // { title: "AI growth", message: "Please update the dashbaord to help me keep track of the current trends in the AI industry." },
        // { title: "Music trends", message: "Please update the dashbaord to help me keep track of the current trends in the Music industry." },

        // New cashflow-focused suggestions
        { title: "Inflows vs Outflows", message: "Create a bar chart showing total inflows vs total outflows" },
        { title: "Balance Trend", message: "Show me a line chart of the balance over time" },
        { title: "Top Expenses", message: "Create a chart showing my top 5 outgoing payments" },
      ]}
      Input={SidebarInput}
      AssistantMessage={AssistantBubble}
      UserMessage={UserBubble}
      RenderSuggestionsList={Suggestions}
    />
  )
}


