import { topic, channel } from "@inngest/realtime";
import { inngest } from "../client";
export const httpRequestChannel = channel("http-request-executor").addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>()
);
export const WORKFLOW_CHANNEL_ID = "workflow-execution";
export const workflowChannel = channel("workflow-execution").addTopic(
  topic("nodestatus").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
    errorMessage?: string;
  }>(),
).addTopic(
    topic("workflowstatus").type<{
      workflowId: string;
      status: "running" | "completed" | "failed" | "cancelled";
      errorMessage?:string;
    }>()
  );
export async function cancelWorkflowAction(workflowId: string) {
  await inngest.send({
    name: "workflow/cancel.workflow",
    data: {
      workflowId,
    },
  });
}