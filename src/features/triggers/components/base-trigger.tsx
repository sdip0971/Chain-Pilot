"use client"
import React, { ReactNode } from 'react'
import { NodeProps,Position, useReactFlow } from '@xyflow/react'
import Image from 'next/image'
import { BaseNode,BaseNodeContent } from '@/components/ui/react-flow/base-node'
import { BaseHandle } from "@/components/ui/react-flow/base-handle";
import { WorkflowNode } from '@/components/ui/mycomponents/workflow-node'
import { LucideIcon } from 'lucide-react'
import { NodeStatus, NodeStatusIndicator } from '@/components/ui/react-flow/node-status-indicator'
interface BaseTriggerNodeProp extends NodeProps {
  name: string;
  description?: string;
  onSettings?: () => void;
  onDoubleClick?: () => void;
  children?: ReactNode;
  icon : LucideIcon | string
  status ? : string
}
function BaseTriggerNode({id,name,description,status="initial",children,icon:Icon,onSettings,onDoubleClick}:BaseTriggerNodeProp) {
  const {setNodes,setEdges} = useReactFlow()
  const handleDelete = () => {
    setNodes((currentNodes) => {
      const updatedNodes = currentNodes.filter((node) => node.id !== id);

      return updatedNodes;
    });
    setEdges((currentEdges)=>{
     const updatedEdges =currentEdges.filter((edge)=>edge.source != id || edge.target != id)
     return updatedEdges
    })

  };

  return (
    <div>
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
      >
       
          <BaseNode
            className="rounded-l-2xl relative group"
            onDoubleClick={onDoubleClick}
            status={status}
          >
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
                  id="source1"
                  type="source"
                  position={Position.Right}
                />
              </div>
            </BaseNodeContent>
          </BaseNode>
      </WorkflowNode>
    </div>
  );
}

export default BaseTriggerNode
