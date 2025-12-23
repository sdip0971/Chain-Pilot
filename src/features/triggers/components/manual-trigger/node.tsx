import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import BaseTriggerNode from "../base-trigger";

import { MousePointerIcon } from "lucide-react";
import { ManualTriggerDialog } from "./dialog";
import UseNodeStatus from "@/hooks/use-node-status";
import { fetchWorkFlowRequestRealtimeToken } from "@/features/executions/lib/action";

export const ManualTriggerNode = memo((props: NodeProps) => {
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
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="When clicking 'Execute workflow'"
         status={nodeStatus} 
         onSettings={handleOpenSettings} 
         onDoubleClick={handleOpenSettings} 
      />
      
    </>
  );
});
