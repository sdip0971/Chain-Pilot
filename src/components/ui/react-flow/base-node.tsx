import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Check, Loader2, X, AlertCircle } from "lucide-react";
import { NodeStatus } from "./node-status-indicator";

interface BaseNodeProps extends ComponentProps<"div"> {
  status?: string;
  selected?: boolean;
}

export function BaseNode({ className, status, selected, children, ...props }: BaseNodeProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl transition-all duration-300",
        "group",
        className
      )}
      tabIndex={0}
      {...props}
    >
      {/* --- 1. GLOWING BACKDROP (The Atmosphere) --- */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100",
          "bg-linear-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl"
        )}
      />

      {/* --- 2. DYNAMIC BORDER (The Shield) --- */}
      {/* Loading: Rotating Energy Ring */}
      {status === "loading" && (
        <div className="absolute -inset-[3px] rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,#3b82f6_50%,transparent_100%)] animate-[spin_2s_linear_infinite]" />
        </div>
      )}

      {/* Static Status Borders */}
      <div className={cn(
        "absolute -inset-px rounded-2xl transition-all duration-300",
        status === "success" ? "bg-emerald-500 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)]" :
        status === "error" ? "bg-rose-500 shadow-[0_0_20px_-5px_rgba(244,63,94,0.5)]" :
        selected ? "bg-primary shadow-[0_0_15px_-5px_rgba(var(--primary),0.5)]" :
        "bg-border/60 group-hover:bg-border"
      )} />

      {/* --- 3. THE GLASS BODY (The Hull) --- */}
      <div className={cn(
        "relative h-full w-full rounded-2xl overflow-hidden",
        "bg-card/90 backdrop-blur-xl", // Glass Effect
        "flex flex-col"
      )}>
        {children}
      </div>

      {/* --- 4. STATUS INDICATOR (The Badge) --- */}
      <StatusBadge status={status} />
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status || status === "initial") return null;

  return (
    <div className={cn(
      "absolute -top-2 -right-2 z-50 p-1.5 rounded-full shadow-lg border border-white/10 backdrop-blur-md transition-all duration-500 scale-0 animate-in zoom-in",
      status === "loading" && "bg-blue-600 text-white",
      status === "success" && "bg-emerald-500 text-white",
      status === "error" && "bg-rose-500 text-white"
    )}>
      {status === "loading" && <Loader2 className="size-3.5 animate-spin" />}
      {status === "success" && <Check className="size-3.5 stroke-3" />}
      {status === "error" && <X className="size-3.5 stroke-3" />}
    </div>
  );
}

// --- Subcomponents ---

export function BaseNodeHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5",
        className
      )}
    />
  );
}

export function BaseNodeHeaderTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn("flex-1 font-medium tracking-tight text-sm text-foreground/90", className)}
      {...props}
    />
  );
}

export function BaseNodeContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("p-4 min-h-[50px] text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}