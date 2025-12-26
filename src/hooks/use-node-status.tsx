import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { Realtime } from "@inngest/realtime";

// Assuming NodeStatus is defined elsewhere or is just a string
type NodeStatus = "initial" | "loading" | "success" | "error" | "cancelled";

interface UseNodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

function UseNodeStatus({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusOptions) {
  const [status, setStatus] = useState<NodeStatus>("initial");

  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    // 1. Filter messages for THIS specific node
    const messages = data.filter((msg) => {
      return (
        msg.kind === "data" &&
        msg.channel === channel &&
        msg.topic === topic &&
        msg.data.nodeId === nodeId
      );
    });

    // 2. Get the LAST message (most recent)
    // We rely on the array order instead of 'createdAt' to avoid date parsing issues
    const latestMessage = messages[messages.length - 1];

    if (latestMessage?.kind === "data") {
      setStatus(latestMessage.data.status as NodeStatus);
    }
  }, [data, nodeId, channel, topic]);

  return status;
}

export default UseNodeStatus;
