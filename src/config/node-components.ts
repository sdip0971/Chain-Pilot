import { InitialNode } from "@/components/ui/mycomponents/intialnode";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { GoogleFormTriggerNode } from "@/features/triggers/components/googleformtrigger/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";
import { NodeType } from "@/generated/prisma/enums"
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAl] : InitialNode,
    [NodeType.MANUAL_TRIGGER]:ManualTriggerNode ,
    [NodeType.HTTP_REQUEST]:HttpRequestNode, 
    [NodeType.GOOGLE_FORM_TRIGGER]:GoogleFormTriggerNode,

}
// {
//   "INITIAL": InitialNode
// } 

export type RegisteredNodeType = keyof typeof nodeComponents;
