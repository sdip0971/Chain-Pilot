"use client";

import { NodeProps, Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "@/components/ui/mycomponents/base-execution-node";
import { Sparkles } from "lucide-react"; // using Sparkles icon for AI

import UseNodeStatus from "@/hooks/use-node-status";
import { WORKFLOW_CHANNEL_ID } from "@/inngest/channels/workflowChannel";
import { fetchWorkFlowRequestRealtimeToken } from "../../lib/action";
import { AnthropicFormValues, AnthropicDialog } from "./dialog";


type AnthropicNodeData = AnthropicFormValues;

type AnthropicNodeType = Node<AnthropicNodeData>;

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);


  const nodeStatus = UseNodeStatus({
    nodeId: props.id,
    channel: WORKFLOW_CHANNEL_ID,
    topic: "nodestatus",
    refreshToken: fetchWorkFlowRequestRealtimeToken
  });

  const handleOpenSettings = () => setDialogOpen(true);
  const { setNodes } = useReactFlow();
  const nodeData = props.data as AnthropicNodeData;


  const description = nodeData.model
    ? `Model: ${nodeData.model}`
    : "Not configured";


  const handleSubmit = (values: AnthropicFormValues) => {
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
     
      <AnthropicDialog
        open={dialogOpen}
        onOpenChangeAction={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}  
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/icons/claude.png"
        name="Anthropic AI"
        description={description}
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
        status={nodeStatus}
      />
    </>
  );
});
