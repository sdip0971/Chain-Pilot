import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface BaseNodeProps extends ComponentProps<"div"> {
  status?: string;
  selected?: boolean;
}

export function BaseNode({
  className,
  status = "initial",
  selected,
  children,
  ...props
}: BaseNodeProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl group transition-all duration-200",
        "bg-card text-card-foreground",
        "border border-border/60",
        "shadow-[0_2px_12px_-6px_rgba(0,0,0,0.12)]",

        // hover: gentle lift
        "hover:-translate-y-px hover:shadow-md",

        // selected: clean focus ring
        selected &&
          "ring-2 ring-primary/40 ring-offset-2 ring-offset-background",

        // loading: soft emphasis (NOT aggressive)
        status === "loading" &&
          "border-primary/50 shadow-[0_0_24px_rgba(59,130,246,0.25)]",

        // success / error: color only
        status === "success" && "border-emerald-500/50",
        status === "error" && "border-red-500/50",

        className
      )}
      tabIndex={0}
      {...props}
    >
      {/* subtle top indicator */}
      <div
        className={cn(
          "absolute top-0 left-3 right-3 h-0.5 rounded-b-full opacity-0 transition-opacity",
          status !== "initial" && "opacity-100",
          status === "loading" && "bg-primary/60",
          status === "success" && "bg-emerald-400",
          status === "error" && "bg-red-500"
        )}
      />

      {/* minimal loader */}
      {status === "loading" && (
        <div className="absolute -top-2 -right-2 bg-background p-1 rounded-full border border-primary/30 shadow-sm">
          <Loader2 className="size-3 animate-spin text-primary" />
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return <div className={cn(className)} {...props} />;
}
