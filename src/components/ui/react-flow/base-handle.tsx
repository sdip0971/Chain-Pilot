import React from "react";
import { Handle, type HandleProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

export const BaseHandle = React.forwardRef<HTMLDivElement, HandleProps>(
  ({ className, ...props }, ref) => {
    return (
      <Handle
        ref={ref}
        className={cn(
          "w-3! h-3! rounded-full border-2",
          "border-muted-foreground! bg-background!",

     
          "transition-all duration-200 ease-out",
          "hover:border-primary! hover:bg-primary! hover:scale-150",
          "hover:shadow-[0_0_14px_rgba(59,130,246,0.9)]",

  
          "relative",
          "before:absolute before:inset-[-5px] before:rounded-full before:opacity-0",
          "before:bg-[conic-gradient(from_0deg,rgba(59,130,246,0),rgba(59,130,246,0.9),rgba(59,130,246,0))]",
          "hover:before:opacity-100 hover:before:animate-[spin_1.4s_linear_infinite]",

          "after:absolute after:inset-[-7px] after:rounded-full after:opacity-0",
          "hover:after:opacity-100 hover:after:animate-ping after:bg-primary/30",

          className
        )}
        {...props}
      />
    );
  }
);
BaseHandle.displayName = "BaseHandle";
