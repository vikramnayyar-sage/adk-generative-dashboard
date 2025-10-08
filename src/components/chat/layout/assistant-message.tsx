"use client";
import type { AssistantMessageProps } from "@copilotkit/react-ui";
import { Markdown } from "@/components/chat/layout/markdown";
import { Cursor } from "@/components/chat/layout/cursor";

export function AssistantBubble({ message, isGenerating, isLoading }: AssistantMessageProps) {
  const content = message?.content ?? "";

  if (!message) return null;
  if (!content && !isLoading && !isGenerating && !message.generativeUI) {
    return null;
  }

  if (isLoading && !message.generativeUI) return <Cursor className="mt-3" />;

  return (
    <div className="py-2">
      <div className="text-foreground rounded-lg p-3">
        <Markdown content={content} />
        {isGenerating && content && (
          <span className="inline-block w-1.5 h-4 ml-1 bg-primary/60 animate-pulse" />
        )}
      </div>

      {message.generativeUI?.()}
    </div>
  );
}
