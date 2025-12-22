import {topic,channel} from "@inngest/realtime"
export const httpRequestChannel = channel("http-request-executor")
.addTopic(
topic("status").type<{
    nodeId:string,
    status: "loading"|"success"|"error"
}>(),
)
export const WORKFLOW_CHANNEL_ID = "workflow-execution";
export const workflowChannel = channel("workflow-execution")
  .addTopic(
    topic("nodestatus").type<{
      nodeId: string;
      status: "loading" | "success" | "error";
    }>()
  );