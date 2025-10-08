import { CopilotChat } from "@copilotkit/react-ui";
import { SidebarInput } from "@/components/chat/layout/input";
import { AssistantBubble } from "@/components/chat/layout/assistant-message";
import { UserBubble } from "@/components/chat/layout/user-message";
import { Suggestions } from "@/components/chat/layout/suggestion";
import { cn } from "@/lib/utils";
import { Header } from "@/components/chat/layout/header";
interface ChatProps {
  className: string;
}

export function Chat({ className }: ChatProps) {
  return (
    <div className={cn(className, "p-4 max-w-[500px]")}>
      <div className="h-full min-h-0 rounded-2xl border bg-card shadow-xl overflow-hidden flex flex-col">
        <Header />
        <CopilotChat
          className="flex-1 min-h-0"
          labels={{
          initial: "👋 Hi!\n\nI'm here to help you analyze your cashflow and build insightful visualizations.\n\nTry some of the suggestions below, or ask me anything about your cashflow data!"
          }}
          suggestions={[
            {
              title: "Review pending invoices",
              message: "Show me all pending invoices and suggest which ones should be paid next based on cashflow."
            },
            {
              title: "Authorise payments",
              message: "Help me select invoices for payment and show how these payments will impact our cashflow."
            },
            {
              title: "Vendor payment summary",
              message: "Summarise recent payments made to vendors and highlight any overdue invoices."
            },
            {
              title: "Projected cashflow",
              message: "Show a projection of our cashflow after making the next round of payments."
            },
            {
              title: "Automate vendor notifications",
              message: "Draft emails to vendors informing them that their payments have been initiated."
            }
          ]}
          Input={SidebarInput}
          AssistantMessage={AssistantBubble}
          UserMessage={UserBubble}
          RenderSuggestionsList={Suggestions}
        />
      </div>
    </div>
  );
}
