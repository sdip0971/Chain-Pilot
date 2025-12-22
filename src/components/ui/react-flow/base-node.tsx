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
        "rounded-2xl", 
        className
      )}
      tabIndex={0}
      {...props}
    >
     
      <div 
        className={cn(
          "absolute -inset-0.5 rounded-2xl opacity-0 blur-xl transition-all duration-500",
          
          "group-hover:opacity-20 bg-foreground",
          
          status === "loading" && "opacity-40 bg-blue-500 animate-pulse",
          status === "success" && "opacity-30 bg-emerald-500",
          status === "error" && "opacity-30 bg-rose-500",
          // Selection State
          selected && !isStatusActive && "opacity-25 bg-primary"
        )}
      />

     
      <div className={cn(
        "relative rounded-2xl border transition-all duration-200 overflow-hidden",
        "bg-card/95 backdrop-blur-sm", 

        "border-border/50", 
        selected ? "border-primary/50 ring-1 ring-primary/20" : "group-hover:border-foreground/20",
        
   
        "group-hover:-translate-y-0.5"
      )}>
        
        
        <div className={cn(
          "absolute top-0 left-0 right-0 h-0.5 opacity-0 transition-opacity duration-500",
          "bg-linear-to-r from-transparent via-current to-transparent",
          isStatusActive && "opacity-100",
          status === "loading" && "text-blue-500",
          status === "success" && "text-emerald-500",
          status === "error" && "text-rose-500"
        )} />

        
        <div className="relative z-10">
          {children}
        </div>
      </div>

   
      <div className={cn(
        "absolute -top-1.5 -right-1.5 z-50 flex items-center justify-center p-1 rounded-full shadow-sm border border-border/10 transition-all scale-0 duration-300 ease-spring",
        isStatusActive && "scale-100",
        status === "loading" && "bg-blue-500 text-white",
        status === "success" && "bg-emerald-500 text-white",
        status === "error" && "bg-rose-500 text-white"
      )}>
        {status === "loading" && <Loader2 className="size-3 animate-spin" />}
        {status === "success" && <Check className="size-3 stroke-3" />}
        {status === "error" && <X className="size-3 stroke-3" />}
      </div>
    </div>
  );
}

export function BaseNodeContent({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-0", className)} {...props} />;
}