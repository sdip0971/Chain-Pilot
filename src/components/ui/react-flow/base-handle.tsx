import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";
import React from "react";

export type BaseHandleProps = HandleProps;

export const BaseHandle = React.forwardRef<HTMLDivElement, HandleProps>(
  ({ className, ...props }, ref) => {
    return (
      <Handle
        ref={ref}
        className={cn(
          // Size & Shape
          "w-4! h-4! rounded-full",
          // Colors (Dark theme optimized)
          "bg-card! border-2! border-muted-foreground/50!",
          // Interaction
          "transition-all duration-300",
          "hover:bg-primary! hover:border-primary! hover:scale-125 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]",
          // Group Hover Effect (Lights up when you hover the node)
          "group-hover:border-primary/50!",
          className
        )}
        {...props}
      />
    );
  }
);
BaseHandle.displayName = "BaseHandle";