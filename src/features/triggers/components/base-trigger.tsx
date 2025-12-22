"use client";

import { NodeProps, Position } from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import { BaseNode,BaseNodeContent } from "@/components/ui/react-flow/base-node";
import { BaseHandle } from "@/components/ui/react-flow/base-handle";

interface BaseTriggerNodeProps extends NodeProps {
  icon: LucideIcon | string;
  name: string;
  status?: string;
  onSettings?: () => void;
  onDoubleClick?: () => void;
}

export default function BaseTriggerNode({
  selected,
  icon,
  name,
  status = "initial",
  onDoubleClick,
}: BaseTriggerNodeProps) {
  return (
    <BaseNode
      selected={selected}
      status={status}
      onDoubleClick={onDoubleClick}
    >
      <BaseNodeContent className="flex items-center gap-3 p-4 min-w-[170px]">
        {/* ICON (component OR svg path) */}
        <div className="flex items-center justify-center size-10 rounded-lg bg-muted/40 border border-border">
          {typeof icon === "string" ? (
            <img
              src={icon}
              alt={name}
              className="h-5 w-5 object-contain"
            />
          ) : (
            (() => {
              const IconComponent = icon;
              return (
                <IconComponent className="h-5 w-5 text-muted-foreground" />
              );
            })()
          )}
        </div>

        {/* TEXT */}
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-semibold text-[13px] truncate">
            {name}
          </span>
          <span className="text-xs text-muted-foreground">
            Trigger
          </span>
        </div>

        {/* OUTPUT HANDLE */}
        <BaseHandle type="source" position={Position.Right} />
      </BaseNodeContent>
    </BaseNode>
  );
}
