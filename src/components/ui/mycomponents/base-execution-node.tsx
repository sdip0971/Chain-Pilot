"use client"
import React, { ReactNode } from 'react'
import { NodeProps,Position, useReactFlow } from '@xyflow/react'
import Image from 'next/image'
import { BaseNode,BaseNodeContent } from '../react-flow/base-node'
import { BaseHandle } from "@/components/ui/react-flow/base-handle";
import { WorkflowNode } from './workflow-node'
import { LucideIcon } from 'lucide-react'
import { NodeStatus, NodeStatusIndicator } from '../react-flow/node-status-indicator'
interface BaseExecutionNodeProp extends NodeProps {
  name: string;
  description?: string;
  onSettings?: () => void;
  onDoubleClick?: () => void;
  children?: ReactNode;
  icon : LucideIcon | string
  status?:NodeStatus
}
function BaseExecutionNode({id,name,description,children,status="initial",icon:Icon,onSettings,onDoubleClick}:BaseExecutionNodeProp) {
  const {setNodes,setEdges} = useReactFlow()
  const handleDelete = () => {
    setNodes((currentNodes) => {
      const updatedNodes = currentNodes.filter((node) => node.id !== id);
      return updatedNodes;
    });
    setEdges((currentEdges)=>{
     return currentEdges.filter((edge) => !(edge.source === id || edge.target === id));
    })
  };
  const nodeStatus = "initial"
  return (
    <div>
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
        
        
      >
        <NodeStatusIndicator variant='border' status={status}>
          <BaseNode onDoubleClick={onDoubleClick}>
            <BaseNodeContent>
              <div className="flex items-center justify-center w-8 h-8">
                {typeof Icon === "string" ? (
                  <Image
                    src={Icon}
                    alt={name}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                ) : (
                  <Icon className="size-6 text-muted-foreground" />
                )}
                {children}
                <BaseHandle
                  id="target1"
                  type="target"
                  position={Position.Left}
                />
                <BaseHandle
                  id="source1"
                  type="source"
                  position={Position.Right}
                />
              </div>
            </BaseNodeContent>
          </BaseNode>
        </NodeStatusIndicator> 
      </WorkflowNode>
    </div>
  );
}

export default BaseExecutionNode
