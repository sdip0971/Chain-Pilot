"use client";

import React, { ReactNode } from "react";
import { NodeProps, Position, useReactFlow } from "@xyflow/react";
import Image from "next/image";
import { BaseNode, BaseNodeContent } from "../react-flow/base-node";
import { BaseHandle } from "@/components/ui/react-flow/base-handle";
import { WorkflowNode } from "./workflow-node";
import { LucideIcon } from "lucide-react";

interface BaseExecutionNodeProp extends NodeProps {
  name: string;
  description?: string;
  onSettings?: () => void;
  onDoubleClick?: () => void;
  children?: ReactNode;
  icon: LucideIcon | string;
  status?: string;
}

export default function BaseExecutionNode({
  id,
  selected,
  name,
  description,
  children,
  status = "initial",
  icon: Icon,
  onSettings,
  onDoubleClick,
}: BaseExecutionNodeProp) {
  const { setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((n) => n.filter((x) => x.id !== id));
    setEdges((e) => e.filter((x) => x.source !== id && x.target !== id));
  };

  return (
    <WorkflowNode
      name={name}
      description={description}
      onSettings={onSettings}
      onDelete={handleDelete}
    >
      <BaseNode selected={selected} status={status} onDoubleClick={onDoubleClick}>
        {/* ⬇️ SMALLER WIDTH + TIGHTER PADDING */}
        <BaseNodeContent className="flex items-center gap-3 p-3 min-w-[150px]">
          {/* ⬇️ SMALLER ICON */}
          <div className="flex items-center justify-center size-9 rounded-lg bg-muted/40 border border-border">
            {typeof Icon === "string" ? (
              <Image src={Icon} alt={name} width={18} height={18} />
            ) : (
              <Icon className="size-4.5 text-muted-foreground" />
            )}
          </div>

          {/* ⬇️ SLIGHTLY SMALLER TEXT */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-semibold text-[13px] truncate">
              {name}
            </span>
            {description && (
              <span className="text-xs text-muted-foreground truncate">
                {description}
              </span>
            )}
          </div>

          {children}

          {/* ports */}
          <BaseHandle type="target" position={Position.Left} />
          <BaseHandle type="source" position={Position.Right} />
        </BaseNodeContent>
      </BaseNode>
    </WorkflowNode>
  );
}
