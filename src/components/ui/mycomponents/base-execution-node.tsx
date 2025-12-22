"use client"
import React, { ReactNode } from 'react'
import { NodeProps, Position, useReactFlow } from '@xyflow/react'
import Image from 'next/image'
import { BaseNode, BaseNodeContent } from '../react-flow/base-node'
import { BaseHandle } from "@/components/ui/react-flow/base-handle";
import { WorkflowNode } from './workflow-node'
import { LucideIcon } from 'lucide-react'

interface BaseExecutionNodeProp extends NodeProps {
  name: string;
  description?: string;
  onSettings?: () => void;
  onDoubleClick?: () => void;
  children?: ReactNode;
  icon: LucideIcon | string;
  status?: string
}

function BaseExecutionNode({
  id,
  selected,
  name,
  description,
  children,
  status = "initial",
  icon: Icon,
  onSettings,
  onDoubleClick
}: BaseExecutionNodeProp) {
  const { setNodes, setEdges } = useReactFlow()
  
  const handleDelete = () => {
    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== id));
    setEdges((currentEdges) => currentEdges.filter((edge) => !(edge.source === id || edge.target === id)));
  };

  return (
    <div className='relative font-sans text-sm'>
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
        <BaseNode selected={selected} onDoubleClick={onDoubleClick} status={status}>
          <BaseNodeContent className='flex flex-col min-w-[240px] max-w-[320px]'>
            
            {/* 1. HEADER: Identity & Control 
                A distinct top section.
            */}
            <div className='flex items-center gap-3 px-4 py-3 bg-muted/30 border-b border-border/40 rounded-tr-lg'>
              
              {/* Icon Container: Inset look */}
              <div className='flex shrink-0 items-center justify-center size-8 rounded-md bg-background border shadow-sm text-muted-foreground'>
                {typeof Icon === "string" ? (
                  <Image src={Icon} alt={name} width={16} height={16} className="object-contain" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>

              {/* Text Layout */}
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-foreground truncate leading-tight">
                  {name}
                </span>
                {description && (
                  <span className="text-[11px] text-muted-foreground truncate font-mono mt-0.5">
                    {description}
                  </span>
                )}
              </div>
            </div>

            {/* 2. BODY: Inputs/Outputs (if children exist) */}
            {children && (
              <div className="px-4 py-3 bg-card rounded-br-lg">
                {children}
              </div>
            )}

            {/* 3. HANDLES: Functional Ports
                Positioned relative to the whole card for balance
            */}
            <BaseHandle id="target1" type="target" position={Position.Left} className="top-[28px]" />
            <BaseHandle id="source1" type="source" position={Position.Right} className="top-[28px]" />
            
          </BaseNodeContent>
        </BaseNode>
      </WorkflowNode>
    </div>
  );
}

export default BaseExecutionNode