"use client";

import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, Icon, MousePointerIcon } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {createId} from "@paralleldrive/cuid2"
import { NodeType } from "@/generated/prisma/enums";
import { Separator } from "../separator";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs the flow on clicking a button. Good for getting started quickly",
    icon: MousePointerIcon,
  },
   {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form submission",
    description: "Runs when a Google Form receives a response",
     icon: "/icons/google-forms.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Makes an HTTP request",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProp{
    open:boolean,
    onOpenChange:(open:boolean)=>void,
    children?:React.ReactNode,
}    
export function NodeSelector({ open, onOpenChange, children }: NodeSelectorProp) {
    const {setNodes,getNodes,screenToFlowPosition} = useReactFlow();
    const handleNodeSelect = useCallback((selection:NodeTypeOption)=>{
        // check if trying to add a manual trigger that already exists
        if(selection.type === NodeType.MANUAL_TRIGGER){
            const nodes = getNodes();
            const hasmanualTrigger = nodes.some((node)=>{ return node.type === NodeType.MANUAL_TRIGGER })
            if(hasmanualTrigger){
                toast.error("Manual Trigger node already exists");
                return;
            }
          }
          
            setNodes((nodes)=> {
                const hasIntialTrigger = nodes.some(
                    (node)=> node.type === NodeType.INITIAl
                )
                //check if no node yet we are creating node from intial placeholder
                
                const centerX = window.innerWidth/2;
                 const centerY = window.innerHeight / 2;
                 // screen to flow postion is used to convert screen cordinates to react flow cordinates supported by react flow canvas
                 const flowPosition = screenToFlowPosition({
                    x: centerX + (Math.random() -0.5) * 200,
                    y: centerY + (Math.random() -0.5) * 200, 
                 })
                 
                //now we create new node
                   const newNode = { 
                     id: createId(),
                     type:selection.type,
                     position: flowPosition,
                     data: {},
                   };
                   
                if( hasIntialTrigger ){ return [newNode] }
                return [...nodes,newNode]
            });
            toast.success("Manual Trigger node added");
            onOpenChange(false);
    },[getNodes,screenToFlowPosition,setNodes,onOpenChange]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>
        <div>
          {triggerNodes.map((nodeType) => {
            const IconComponent = nodeType.icon as any;
            return (
              <div
                key={nodeType.type}
                className="
                w-full justify-start h-auto py-5 px-4
                rounded-none cursor-pointer border-l-2 border-transparent
                hover:border-l-primary
              "
                onClick={() => {handleNodeSelect(nodeType)}}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof nodeType.icon === "string" ? (
                    <img
                      src={nodeType.icon}
                      alt={nodeType.label}
                      className="h-5 object-contain rounded-sm"
                    />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      
        <div>
          {executionNodes.map((nodeType) => {
            const IconComponent = nodeType.icon as any;
            return (
              <div
                key={nodeType.type}
                className="
                w-full justify-start h-auto py-5 px-4
                rounded-none cursor-pointer border-l-2 border-transparent
                hover:border-l-primary
              "
                onClick={() => {handleNodeSelect(nodeType);}}
              >
                <div className="flex items-center gap-6 w-full overflow-hidden">
                  {typeof nodeType.icon === "string" ? (
                    <img
                      src={nodeType.icon}
                      alt={nodeType.label}
                      className="h-5 object-contain rounded-sm"
                    />
                  ) : (
                    <IconComponent className="h-5 w-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}


