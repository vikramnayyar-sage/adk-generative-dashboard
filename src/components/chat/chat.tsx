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

export function Chat({className}: ChatProps) {  
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
            // Old suggestions - commented out
            // { title: "Pizza sales", message: "Please rebuild the dashboard to help me keep track of the current trends in the Pizza industry." },
            // { title: "AI growth", message: "Please rebuild the dashboard to help me keep track of the current trends in the AI industry." },
            // { title: "Music trends", message: "Please rebuild the dashboard to help me keep track of the current trends in the Music industry." },

            // New cashflow-focused suggestions
            { title: "Inflows vs Outflows", message: "Create a bar chart showing total inflows vs total outflows" },
            { title: "Biggest Outflows Party", message: "Which party do I spend the most on?" },
            { title: "Top Expenses", message: "Create a chart showing my top 5 outgoing payments" },
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
