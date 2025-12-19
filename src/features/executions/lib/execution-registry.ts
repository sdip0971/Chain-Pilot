import { Node, NodeType } from "@/generated/prisma/client";
import type { GetStepTools,Inngest } from "inngest";
import { httprequestexecutor, manualtriggerexecutor } from "./executors";
type WorkflowContext = Record<string,unknown>;
export type StepTools = GetStepTools<Inngest.Any>;
interface NodeExecutorParams<TData= Record<string,unknown>>{
    data : TData,
    nodeId : string,
    context : WorkflowContext,
    step : StepTools
}
export type NodeExecutor<TData= Record<string,unknown>> = (
    params : NodeExecutorParams<TData>,
)=>Promise<WorkflowContext>


export const executorRegistry:Record<NodeType,NodeExecutor> = {
[NodeType.MANUAL_TRIGGER] : manualtriggerexecutor,
 [NodeType.HTTP_REQUEST] : httprequestexecutor,
 [NodeType.INITIAl] : manualtriggerexecutor
}
export const getExecutor = (type:NodeType):NodeExecutor=>{
    const executor = executorRegistry[type]
    if(!executor){
        throw new Error("No executor found for this Node Type")
    }
    return executor
}

