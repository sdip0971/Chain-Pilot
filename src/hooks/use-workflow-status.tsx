import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { Realtime } from "@inngest/realtime";

interface UseWorkflowStatusOptions {
  workflowId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}
export const useWorkflowStatus = ({
  workflowId,
  channel,
  topic,
  refreshToken,
}: UseWorkflowStatusOptions)=>{
    const [status, setStatus] = useState<
      "idle" | "running" | "completed" | "failed" | "cancelled"
    >("idle");
    const[error,setError]=useState("")
    const { data } = useInngestSubscription({
      refreshToken,
      enabled: true,
    });
    useEffect(()=>{
        if(!data) return
    const latestMessage = data
      .filter((msg) => {
        return (
          msg.kind === "data" &&
          msg.channel === channel &&
          msg.topic === topic &&
          msg.data.workflowId === workflowId
        );
      })
      .sort((a, b) => {
        if (a.kind === "data" && b.kind === "data") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      })[0];


      if (latestMessage?.kind === "data") {
        setStatus(latestMessage.data.status);
        setError(latestMessage.data.errorMessage)
      }

    },[data,workflowId,channel,topic])

        return {status,error}
}