"use server"
import { inngest } from "@/inngest/client";

export async function cancelWorkflowAction(
  workflowId: string,
  executionId?: string
) {
  await inngest.send({
    name: "workflow/cancel.workflow",
    data: {
      workflowId,
      executionId,
    },
  });
}
