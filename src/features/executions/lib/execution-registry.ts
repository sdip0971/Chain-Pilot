import { Node, NodeType } from "@/generated/prisma/client";
import type { GetStepTools,Inngest } from "inngest";
import { HTTP_TRIGGER_DATA, httprequestexecutor, MANUAL_TRIGGER_DATA, manualtriggerexecutor } from "./executors";
import type { Realtime } from "@inngest/realtime";
type WorkflowContext = Record<string,unknown>;
export type StepTools = GetStepTools<Inngest.Any>;

interface NodeExecutorParams<TData= Record<string,unknown>>{
    data : TData,
    nodeId : string,
    context : WorkflowContext,
    step : StepTools,
    publish: Realtime.PublishFn
}
export type NodeExecutor<TData = Record<string,unknown>> = (
    params : NodeExecutorParams<TData>,
)=>Promise<WorkflowContext>

type NodeDataMap = {
  [NodeType.MANUAL_TRIGGER]: MANUAL_TRIGGER_DATA;
  [NodeType.HTTP_REQUEST]: HTTP_TRIGGER_DATA;
  [NodeType.INITIAl]: MANUAL_TRIGGER_DATA;
};


export const executorRegistry: {
  [K in keyof NodeDataMap]: NodeExecutor<NodeDataMap[K]>;
} = {
  [NodeType.MANUAL_TRIGGER]: manualtriggerexecutor,
  [NodeType.HTTP_REQUEST]: httprequestexecutor,
  [NodeType.INITIAl]: manualtriggerexecutor
};
export const getExecutor = <T extends keyof NodeDataMap>(type: T): NodeExecutor<NodeDataMap[T]>=>{
    const executor = executorRegistry[type]
    if(!executor){
        throw new Error("No executor found for this Node Type")
    }
    return executor
}

