import type { ComponentProps, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { NodeStatus } from "./node-status-indicator";
import { Check, CheckCircle2Icon, Loader2, Loader2Icon, X, XCircleIcon } from "lucide-react";
interface BaseNodeProps extends ComponentProps<"div"> {
status?:string;

}
export function BaseNode({ className, status, children, ...props }: BaseNodeProps) {
  return (
    <div
      className={cn(
        "group relative rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out",
        // 1. Base Interaction (Lift & Glow on Hover)
        "hover:border-primary/50 hover:shadow-md hover:-translate-y-[2px]",

        // 2. React Flow Selection State (Blue Ring)
        "[.react-flow__node.selected_&]:border-primary [.react-flow__node.selected_&]:ring-1 [.react-flow__node.selected_&]:ring-primary",

        // 3. Status: Error (Red Glow)
        status === "error" && "border-red-500/60 shadow-[0_0_20px_-5px_rgba(239,68,68,0.4)]",

        // 4. Status: Success (Green Glow)
        status === "success" && "border-emerald-500/60 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]",

        // 5. Status: Loading (Blue Pulse)
        status === "loading" && "border-blue-500/60 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]",

        className
      )}
      tabIndex={0}
      {...props}
    >
      {children}

      {/* 6. The Floating Status Badge */}
      <StatusBadge status={status} />
    </div>
  );
}
function StatusBadge({ status }: { status?: string }) {
  if (!status || status === "initial") return null;

  return (
    <div
      className={cn(
        "absolute -top-2.5 -right-2.5 z-50 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background shadow-sm transition-all duration-300",
        status === "error" && "bg-red-500 text-white animate-in zoom-in slide-in-from-bottom-2",
        status === "success" && "bg-emerald-500 text-white animate-in zoom-in slide-in-from-bottom-2",
        status === "loading" && "bg-blue-500 text-white"
      )}
    >
      {status === "error" && <X className="size-3.5 stroke-[4]" />}
      {status === "success" && <Check className="size-3.5 stroke-[4]" />}
      {status === "loading" && <Loader2 className="size-3.5 animate-spin stroke-[3]" />}
    </div>
  );
}

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
        // Remove or modify these classes if you modify the padding in the
        // `<BaseNode />` component.
        className,
      )}
    />
  );
}

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn("user-select-none flex-1 font-semibold", className)}
      {...props}
    />
  );
}

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-y-2 p-3", className)}
      {...props}
    />
  );
}

export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3",
        className,
      )}
      {...props}
    />
  );
}
