import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger";

import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import UseNodeStatus from "@/hooks/use-node-status";
import { fetchHttpRequestRealtimeToken } from "@/features/executions/components/http-request/action";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
   const nodeStatus = UseNodeStatus({
    nodeId:props.id,
    channel:"workflow-execution",
    topic:"nodestatus",
    refreshToken:fetchHttpRequestRealtimeToken
  })
  const handleOpenSettings = () => setDialogOpen(true); 
  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
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
