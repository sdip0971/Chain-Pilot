import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Check, X, AlertCircle } from "lucide-react";

interface BaseNodeProps extends ComponentProps<"div"> {
  status?: string;
  selected?: boolean;
}

export function BaseNode({ className, status, selected, children, ...props }: BaseNodeProps) {
  // Map status to semantic colors (using Tailwind classes)
  const statusColor = 
    status === "loading" ? "bg-blue-500" :
    status === "success" ? "bg-emerald-500" :
    status === "error" ? "bg-rose-500" :
    selected ? "bg-primary" : "bg-transparent";

  const isStatusActive = status && status !== "initial";

  return (
    <div
      className={cn(
        "relative group transition-all duration-300 ease-out",
        "rounded-2xl", // Softer corners feel more organic/playful
        className
      )}
      tabIndex={0}
      {...props}
    >
      {/* 1. AMBIENT GLOW LAYER (The "Soul")
          - Positioned behind the node
          - Heavily blurred
          - Reacts to Hover/Selection/Status
      */}
      <div 
        className={cn(
          "absolute -inset-0.5 rounded-2xl opacity-0 blur-xl transition-all duration-500",
          // Default Hover State: Soft grey light
          "group-hover:opacity-20 bg-foreground",
          // Active Status States override hover
          status === "loading" && "opacity-40 bg-blue-500 animate-pulse",
          status === "success" && "opacity-30 bg-emerald-500",
          status === "error" && "opacity-30 bg-rose-500",
          // Selection State
          selected && !isStatusActive && "opacity-25 bg-primary"
        )}
      />

      {/* 2. THE PHYSICAL NODE (The "Body") 
          - Needs a background to sit on top of the glow
          - Subtle border interaction
      */}
      <div className={cn(
        "relative rounded-2xl border transition-all duration-200 overflow-hidden",
        "bg-card/95 backdrop-blur-sm", // Glassy feel
        // Border Logic:
        "border-border/50", 
        selected ? "border-primary/50 ring-1 ring-primary/20" : "group-hover:border-foreground/20",
        
        // Lift effect on hover (Playful)
        "group-hover:-translate-y-0.5"
      )}>
        
        {/* 3. STATUS INDICATOR (The "Pulse") 
            A very subtle top edge light, like a device led
        */}
        <div className={cn(
          "absolute top-0 left-0 right-0 h-[2px] opacity-0 transition-opacity duration-500",
          "bg-gradient-to-r from-transparent via-current to-transparent",
          isStatusActive && "opacity-100",
          status === "loading" && "text-blue-500",
          status === "success" && "text-emerald-500",
          status === "error" && "text-rose-500"
        )} />

        {/* 4. CONTENT */}
        <div className="relative z-10">
          {children}
        </div>
      </div>

      {/* 5. FLOATING BADGE (Micro-Feedback) 
          Popping out on the top-right
      */}
      <div className={cn(
        "absolute -top-1.5 -right-1.5 z-50 flex items-center justify-center p-1 rounded-full shadow-sm border border-border/10 transition-all scale-0 duration-300 ease-spring",
        isStatusActive && "scale-100",
        status === "loading" && "bg-blue-500 text-white",
        status === "success" && "bg-emerald-500 text-white",
        status === "error" && "bg-rose-500 text-white"
      )}>
        {status === "loading" && <Loader2 className="size-3 animate-spin" />}
        {status === "success" && <Check className="size-3 stroke-[3]" />}
        {status === "error" && <X className="size-3 stroke-[3]" />}
      </div>
    </div>
  );
}

export function BaseNodeContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-0", className)} {...props} />;
}