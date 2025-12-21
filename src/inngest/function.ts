import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./topological-sort";
import { getExecutor } from "@/features/executions/lib/execution-registry";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
  },
  {
    event: "workflow/execute.workflow",
  },
  async ({ event, step }) => {
    const workflowid = event.data.workflowId
    if(!workflowid){
      throw new NonRetriableError("Workflow Id is missing")
    }
  

    const Sortednodes = await step.run("prepare-workflow",async()=>{
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where : {
          id:workflowid
        },
        include:{
          Nodes:true,
          Connections:true,
        },
      })

      return topologicalSort({nodes:workflow.Nodes,edges:workflow.Connections})
    })
    let context = (event.data.intitalData || {})
    console.log(Sortednodes)
    for(const node of Sortednodes){
      const executor = getExecutor(node.type)
      context  = await executor({
        data:node.data as Record<string,unknown>,
        nodeId : node.id,
        context,
        step

      })
    }
  return {
    workflowid,
    result:context,
  }
  }
);
