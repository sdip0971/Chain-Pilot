import React from "react";
import { Handle, type HandleProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

export const BaseHandle = React.forwardRef<HTMLDivElement, HandleProps>(
  ({ className, ...props }, ref) => {
    return (
      <Handle
        ref={ref}
        className={cn(
          "w-3! h-3! rounded-full",
          "bg-background! border! border-muted-foreground",

          // subtle hover affordance
          "transition-colors duration-150",
          "hover:border-primary! hover:bg-primary!",

          className
        )}
        {...props}
      />
    );
  }
);

BaseHandle.displayName = "BaseHandle";
