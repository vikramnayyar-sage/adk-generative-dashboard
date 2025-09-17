import { useCopilotAction } from "@copilotkit/react-core";
import { Card, CardContent } from "@/components/ui/card";

export const useSearchActions = () => {
  useCopilotAction({
    name: "SearchAgent",
    available: "disabled",
    description: "Search the internet for the query.",
    render: ({ args, status }) => {
      const { request } = args;
      return <Card className="text-sm py-2 m-0 bg-accent/10 border-accent/40">
        <CardContent>
          { status !== "complete" ? 
            <div className="animate-pulse">Searching the internet for: <span className="font-bold">{request}</span></div> :
            <div>Searched the internet for: <span className="font-bold">{request}</span></div>
          }
        </CardContent>
      </Card>
    },
  });
};