import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger";

import { MousePointerIcon } from "lucide-react";

import UseNodeStatus from "@/hooks/use-node-status";
import { fetchWorkFlowRequestRealtimeToken } from "@/features/executions/lib/action";
import { StripeTriggerDialog } from "./dialog";

export const StripeTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
   const nodeStatus = UseNodeStatus({
    nodeId:props.id,
    channel:"workflow-execution",
    topic:"nodestatus",
    refreshToken:fetchWorkFlowRequestRealtimeToken
  })
  const handleOpenSettings = () => setDialogOpen(true); 
  return (
    <>
      <StripeTriggerDialog open={dialogOpen} onOpenChangeAction={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/icons/image.png"
        name="Stripe"
        // description="When stipe event is captured" //todo add description
         status={nodeStatus} 
         onSettings={handleOpenSettings} 
         onDoubleClick={handleOpenSettings} 
      />
      
    </>
  );
});
