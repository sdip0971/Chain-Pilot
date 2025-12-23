import { InitialNode } from "@/components/ui/mycomponents/intialnode";
import { AnthropicNode } from "@/features/executions/components/Anthropic/node";
import { GeminiNode } from "@/features/executions/components/Gemini/node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { OpenAINode } from "@/features/executions/components/Openai/node";
import { GoogleFormTriggerNode } from "@/features/triggers/components/googleformtrigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripetrigger/node";
import { NodeType } from "@/generated/prisma/enums"
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
  [NodeType.INITIAl]: InitialNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.HTTP_REQUEST]: HttpRequestNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.ANTHROPIC]: AnthropicNode,
  [NodeType.OPENAI]: OpenAINode,
};
// {
//   "INITIAL": InitialNode
// } 

export type RegisteredNodeType = keyof typeof nodeComponents;
