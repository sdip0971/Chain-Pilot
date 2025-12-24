"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../button";
import { FlaskConicalIcon, Loader2, Square } from "lucide-react";
import { useExecuteWorkflow } from "@/hooks/use-workflows";
import {
  cancelWorkflowAction,
  WORKFLOW_CHANNEL_ID,
} from "@/inngest/channels/workflowChannel";
import { toast } from "sonner";
import { useWorkflowStatus } from "@/hooks/use-workflow-status";
import { fetchWorkFlowRequestRealtimeToken } from "@/features/executions/lib/action";
import { error } from "console";
function ExecuteButton({ workflowId }: { workflowId: string }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const executeWorkflow = useExecuteWorkflow();
  const { status, error } = useWorkflowStatus({
    workflowId,
    channel: WORKFLOW_CHANNEL_ID,
    topic: "workflowstatus",
    refreshToken: useCallback(async () => {
      return await fetchWorkFlowRequestRealtimeToken();
    }, []),
  });
  useEffect(() => {
    if (error) toast.error(`Error: ${error}`);
  }, [error]);
  const isExecuting = status === "running";
  const handleExecute = () => {
    executeWorkflow.mutate({ id: workflowId });
  };
  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      await cancelWorkflowAction(workflowId);
      toast.info("Cancellation requested");
    } catch (error) {
      toast.error("Failed to cancel workflow");
    } finally {
      setIsCancelling(false);
    }
  };
  if (error) {
    toast(`Error occured : ${error}`);
  }
  return (
    <div className="flex gap-2">
      {!isExecuting && (
        <Button
          onClick={handleExecute}
          size="lg"
          disabled={executeWorkflow.isPending}
        >
          {executeWorkflow.isPending ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <FlaskConicalIcon className="size-4 mr-2" />
          )}
          Execute Workflow
        </Button>
      )}

      {isExecuting && (
        <Button
          onClick={handleCancel}
          size="lg"
          variant="destructive"
          disabled={isCancelling}
        >
          {isCancelling ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <Square className="size-4 mr-2" fill="currentColor" />
          )}
          {isCancelling ? "Stopping..." : "Stop Execution"}
        </Button>
      )}
    </div>
  );
}

export default ExecuteButton;
