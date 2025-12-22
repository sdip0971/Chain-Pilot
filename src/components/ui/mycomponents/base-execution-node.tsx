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
  status?:string
}
function BaseExecutionNode({id,selected,name,description,children,status="initial",icon:Icon,onSettings,onDoubleClick}:BaseExecutionNodeProp) {
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
  return (
    <div className='relative'>
      <WorkflowNode
        name={name}
        description={description}
        onSettings={onSettings}
        onDelete={handleDelete}
        
        
      >
        
          <BaseNode selected={selected} onDoubleClick={onDoubleClick} status={status}>
            <BaseNodeContent className='flex items-center justify-center size-10 rounded-xl bg-secondary/50 border border-white/5 shadow-inner'>
              <div >
                <div className='className="flex items-center justify-center w-8 h-8"'>
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
                </div>

                //description

                <div className="flex flex-col gap-0.5">
               <span className="font-semibold text-sm leading-none tracking-tight">{name}</span>
               {description && (
                 <span className="text-xs text-muted-foreground truncate max-w-[150px] font-mono opacity-80">
                   {description}
                 </span>
               )}
               </div>

                {children}
                
               <BaseHandle id="target1" type="target" position={Position.Left} />
            <BaseHandle id="source1" type="source" position={Position.Right} />
              </div>
            </BaseNodeContent>
          </BaseNode>
      </WorkflowNode>
    </div>
  );
}

export default BaseExecutionNode
