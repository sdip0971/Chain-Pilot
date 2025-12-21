import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { workflowChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";

export type HttpRequestToken = Realtime.Token<
  typeof workflowChannel,
  ["nodestatus"]
>;

export async function fetchHttpRequestRealtimeToken(): Promise<HttpRequestToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: workflowChannel(),
    topics: ["nodestatus"],
  });
  return token
}
