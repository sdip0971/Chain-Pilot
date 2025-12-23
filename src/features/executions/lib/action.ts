"use server"
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { workflowChannel } from "@/inngest/channels/workflowChannel";
import { inngest } from "@/inngest/client";

export type WorkflowToken = Realtime.Token<
  typeof workflowChannel,
  ["nodestatus"]
>;

export async function fetchWorkFlowRequestRealtimeToken(): Promise<WorkflowToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: workflowChannel(),
    topics: ["nodestatus"],
  });
  return token
}
