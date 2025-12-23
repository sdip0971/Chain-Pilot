"use client";

import { NodeProps, Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "@/components/ui/mycomponents/base-execution-node";
import { Sparkles } from "lucide-react"; // using Sparkles icon for AI
import { OpenAIDialog, OpenAIFormValues } from "./dialog";
import UseNodeStatus from "@/hooks/use-node-status";
import { WORKFLOW_CHANNEL_ID } from "@/inngest/channels/workflowChannel";

import { fetchWorkFlowRequestRealtimeToken } from "../../lib/action";


type OpenAINodeData = OpenAIFormValues;

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);


  const nodeStatus = UseNodeStatus({
    nodeId: props.id,
    channel: WORKFLOW_CHANNEL_ID,
    topic: "nodestatus",
    refreshToken: fetchWorkFlowRequestRealtimeToken
  });

  const handleOpenSettings = () => setDialogOpen(true);
  const { setNodes } = useReactFlow();
  const nodeData = props.data as OpenAINodeData;


  const description = nodeData.model
    ? `Model: ${nodeData.model}`
    : "Not configured";


  const handleSubmit = (values: OpenAIFormValues) => {
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
      <OpenAIDialog
        open={dialogOpen}
        onOpenChangeAction={setDialogOpen}
        onSubmit={handleSubmit}
        defaultValues={nodeData}
      />

      <BaseExecutionNode
        {...props}
        id={props.id}
        icon="/icons/openai-svgrepo-com.svg"
        name="OpenAI AI"
        description={description}
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
        status={nodeStatus}
      />
    </>
  );
});
