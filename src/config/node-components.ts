import { InitialNode } from "@/components/ui/mycomponents/intialnode";
import { NodeType } from "@/generated/prisma/enums"
import type { NodeTypes } from "@xyflow/react"

export const nodeComponents = {
    [NodeType.INITIAl] : InitialNode,
}
// {
//   "INITIAL": InitialNode
// }

export type RegisteredNodeType = keyof typeof nodeComponents;
