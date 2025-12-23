"use client";

import { NodeProps, Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "@/components/ui/mycomponents/base-execution-node";
import { Sparkles } from "lucide-react"; // using Sparkles icon for AI

import UseNodeStatus from "@/hooks/use-node-status";
import { WORKFLOW_CHANNEL_ID } from "@/inngest/channels/workflowChannel";
import { fetchWorkFlowRequestRealtimeToken } from "../../lib/action";
import { GeminiDialog, GeminiFormValues } from "./dialog";


type GeminiNodeData = GeminiFormValues;

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);


  const nodeStatus = UseNodeStatus({
    nodeId: props.id,
    channel: WORKFLOW_CHANNEL_ID,
    topic: "nodestatus",
    refreshToken: fetchWorkFlowRequestRealtimeToken
  });

  const handleOpenSettings = () => setDialogOpen(true);
  const { setNodes } = useReactFlow();
  const nodeData = props.data as GeminiNodeData;


  const description = nodeData.model
    ? `Model: ${nodeData.model}`
    : "Not configured";


  const handleSubmit = (values: GeminiFormValues) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...values, 
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <>
     
      <GeminiDialog
        open={dialogOpen}
        onOpenChangeAction={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}  
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/icons/image.svg"
        name="Gemini AI"
        description={description}
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
        status={nodeStatus}
      />
    </>
  );
});
