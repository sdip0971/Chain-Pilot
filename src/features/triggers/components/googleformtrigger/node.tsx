import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger";

import { MousePointerIcon } from "lucide-react";
import { GoogleFormTriggerDialog } from "./dialog";
import UseNodeStatus from "@/hooks/use-node-status";
import { fetchWorkFlowRequestRealtimeToken } from "@/features/executions/lib/action";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
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
      <GoogleFormTriggerDialog open={dialogOpen} onOpenChangeAction={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon="/icons/google-forms.svg"
        name="When Google Form is submitted"
         status={nodeStatus} 
         onSettings={handleOpenSettings} 
         onDoubleClick={handleOpenSettings} 
      />
      
    </>
  );
});
