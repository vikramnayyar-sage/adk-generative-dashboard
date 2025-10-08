import { cn } from "@/lib/utils";

export const Cursor = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center gap-2 py-2", className)}>
      <div className="flex gap-1.5 items-center px-3 py-2 rounded-lg bg-accent/10 border border-accent/20">
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
        <span className="text-sm text-muted-foreground ml-1">Thinking...</span>
      </div>
    </div>
  );
};