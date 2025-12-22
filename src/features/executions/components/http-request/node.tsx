"use client"

import { NodeProps, Node, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import BaseExecutionNode from "@/components/ui/mycomponents/base-execution-node";
import { GlobeIcon } from "lucide-react";
import { HttpRequestDialog, HttpRequestFormValues } from "./dialog";
import UseNodeStatus from "@/hooks/use-node-status";
import { fetchHttpRequestRealtimeToken } from "./action";
import { WORKFLOW_CHANNEL_ID } from "@/inngest/channels/workflowChannel";
type HttpRequestNodeData = {
  variableName?:string,
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;
// This is a Generic Type provided by React Flow.

// TypeScript

// // React Flow's definition looks like this:
// type Node<T> = {
//   id: string;        // Standard hardcoded field
//   position: {x, y};  // Standard hardcoded field
//   data: T;           // <--- THE VARIABLE PART
// }




// Just for memory -> note that here you get the props from react flow here 
// the parent element is react flow itself 
// When you pass your list of nodes to it:
// <ReactFlow nodes={nodes} nodeTypes={nodeComponents} ... />
//What React Flow does internally
//nodes.map((node) => {
//   const Component = nodeTypes[node.type]; // Finds "HttpRequestNode"
//   return (
//     <Component
//       id={node.id}       // <--- AUTOMATICALLY PASSED
//       data={node.data}   // <--- AUTOMATICALLY PASSED
//       selected={node.selected}
//       // ... other internal props
//     />
//   );
// });
export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen , setDialogOpen] = useState(false);
  const nodeStatus = UseNodeStatus({
    nodeId:props.id,
    channel:WORKFLOW_CHANNEL_ID,
    topic:"nodestatus",
    refreshToken:fetchHttpRequestRealtimeToken
  })
  const handleOpenSettings = ()=>setDialogOpen(true)
  const {setNodes} = useReactFlow()
    const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData?.endpoint ? `${nodeData.method || "GET"} ${nodeData.endpoint}` : "Not configured";
   const handleSubmit = (values:HttpRequestFormValues) => {
     setNodes((nodes) =>
       nodes.map((node) => {
         if (node.id === props.id) {
           return {
             ...node,
             data: {
               ...node.data,
               endpoint: values.endpoint,
               method: values.method,
               body: values.body,
             },
           };
         }
         return node;
       })
     );
   };

  return <>
  <HttpRequestDialog open={dialogOpen} onOpenChangeAction={setDialogOpen}  onSubmit={handleSubmit} defaultEndpoint={nodeData.endpoint} defaultMethod={nodeData.method || "GET"} defaultBody={nodeData.body} />
  <BaseExecutionNode  {...props} 
      id={props.id}
      icon={GlobeIcon} 
      name ="HTTP Request"
      description={description}
      onDoubleClick={handleOpenSettings}
      onSettings={handleOpenSettings}
      status={nodeStatus}
       />
  </>
});
