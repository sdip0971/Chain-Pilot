import { Node, NodeType } from "@/generated/prisma/client";
import type { Anthropic, GetStepTools,Inngest } from "inngest";
import { Anthropic_TRIGGER_DATA, AnthropicExecutor, GEMINI_TRIGGER_DATA, GeminiExecutor, GoogleForm_TRIGGER_DATA, GoogleFormtriggerexecutor, HTTP_TRIGGER_DATA, httprequestexecutor, MANUAL_TRIGGER_DATA, manualtriggerexecutor, OPENAI_TRIGGER_DATA, OPENAIExecutor, Stripe_TRIGGER_DATA, Stripetriggerexecutor } from "./executors";
import type { Realtime } from "@inngest/realtime";
type WorkflowContext = Record<string,unknown>;
export type StepTools = GetStepTools<Inngest.Any>;

interface NodeExecutorParams<TData= Record<string,unknown>>{
    data : TData,
    nodeId : string,
    context : WorkflowContext,
    step : StepTools,
    userId:string,
    
    
}
export type NodeExecutor<TData = Record<string,unknown>> = (
    params : NodeExecutorParams<TData>,
)=>Promise<WorkflowContext>

type NodeDataMap = {
  [NodeType.MANUAL_TRIGGER]: MANUAL_TRIGGER_DATA;
  [NodeType.HTTP_REQUEST]: HTTP_TRIGGER_DATA;
  [NodeType.INITIAl]: MANUAL_TRIGGER_DATA;
  [NodeType.GOOGLE_FORM_TRIGGER]:GoogleForm_TRIGGER_DATA;
  [NodeType.STRIPE_TRIGGER]:Stripe_TRIGGER_DATA;
  [NodeType.GEMINI]:GEMINI_TRIGGER_DATA
  [NodeType.ANTHROPIC]:Anthropic_TRIGGER_DATA,
  [NodeType.OPENAI]:OPENAI_TRIGGER_DATA

}; 


export const executorRegistry: {
  [K in keyof NodeDataMap]: NodeExecutor<NodeDataMap[K]>;
} = {
  [NodeType.MANUAL_TRIGGER]: manualtriggerexecutor,
  [NodeType.HTTP_REQUEST]: httprequestexecutor,
  [NodeType.INITIAl]: manualtriggerexecutor,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormtriggerexecutor,
  [NodeType.STRIPE_TRIGGER]: Stripetriggerexecutor,
  [NodeType.GEMINI]: GeminiExecutor,
  [NodeType.ANTHROPIC]: AnthropicExecutor,
  [NodeType.OPENAI]:OPENAIExecutor
};
export const getExecutor = <T extends keyof NodeDataMap>(type: T): NodeExecutor<NodeDataMap[T]>=>{
    const executor = executorRegistry[type]
    if(!executor){
        throw new Error("No executor found for this Node Type")
    }
    return executor
}

