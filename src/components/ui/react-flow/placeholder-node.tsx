"use client";

import React, { useCallback, type ReactNode } from "react";
import {
  useReactFlow,
  useNodeId,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { BaseNode } from "./base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: ()=>void

};

export function PlaceholderNode({ children,onClick }: PlaceholderNodeProps) {


  return (
    <BaseNode
      className="bg-card w-auto h-auto p-4 shadow-none text-gray-400   border-dashed  text-center hover:border-gray-500 hover:bg-gray-50"
      onClick={onClick}
    >
      {children}
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}
