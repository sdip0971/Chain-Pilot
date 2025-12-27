
import {Node, Connection } from "@prisma/client";
import { inngest } from "./client";
import { createId } from "@paralleldrive/cuid2";
//why topological sort 

// In a workflow, some steps depend on others.

// Trigger: "New Order Received" (Creates order_id).

// Database: "Get Customer Email" (Needs order_id).

// Email: "Send Receipt" (Needs customer_email).

// If you run the Email step first, it fails because it doesn't have the email address yet. Topological Sort figures out the only valid order to run these tasks so that no task starts before its ingredients are ready.


export const topologicalSort = ({nodes,edges}:{nodes:Node[],edges:Connection[]})=>{
    const sorted: string[] = []; // The final safe list of IDs
  const inDegree = new Map<string, number>(); // Tracks dependencies
  const adj = new Map<string, string[]>(); // Tracks connections

  // 1. Setup: Everyone starts with 0 dependencies
  nodes.forEach((node) => {
    inDegree.set(node.id, 0);
    adj.set(node.id, []);
  });

  // 2. Count: For every wire, add 1 to the target's dependency count
  edges.forEach((edge) => {
    const destId = edge.DestinationNodeId;
    // "Target needs Source to finish first"
    adj.get(edge.SourceNodeId)?.push(edge.DestinationNodeId);
    inDegree.set(destId, (inDegree.get(destId) ?? 0) + 1);
  });
  // 3. Start: Find nodes with 0 dependencies (The Triggers)
  const queue: string[] = [];
  inDegree.forEach((count, id) => {
    if (count === 0) queue.push(id);
  });
  // 4. Process: The "Wave"
  while (queue.length > 0) {
    const currentId = queue.shift()!; // Take top node and removes from queue just like top() and pop() in c++
    sorted.push(currentId); // Add to final list

    // "Pretend" to remove this node. 
    // Tell its neighbors: "Your parent is done!"
    const neighbors = adj.get(currentId) || [];
    for (const neighbor of neighbors) {
      const newCount = (inDegree.get(neighbor) || 0) - 1;
      inDegree.set(neighbor, newCount);

      // If neighbor is now ready (count is 0), add to queue
      if (newCount === 0) {
        queue.push(neighbor);
      }
    }
  }
// 5. Safety: If graph has a loop (A->B->A), it throws error
  if (sorted.length !== nodes.length) {
    throw new Error("Cycle detected! Infinite loop.");
  }
  // For Faster lookup im doing this
  const nodeMap :Map <string,Node> = new Map (nodes.map((node)=>{
    return [node.id,node]
  }))
  // Mapping sorted id's to actual nodes
  return sorted.map((n)=>nodeMap.get(n))
}

export const sendWorkflowExecution = async(data: {
  workflowId:string;
  [key : string]:any
})=>{
      await inngest.send({
            name:"workflow/execute.workflow",
            data,
            id:createId()
        })
}