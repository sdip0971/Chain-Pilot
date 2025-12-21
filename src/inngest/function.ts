import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./topological-sort";
import { getExecutor } from "@/features/executions/lib/execution-registry";
import { httpRequestChannel, workflowChannel } from "./channels/http-request";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
  },
  {
    event: "workflow/execute.workflow",
    channels:[
      httpRequestChannel(),
    ]
  },
  async ({ event, step, publish }) => {
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
      const nodeId=node.id
      const executor = getExecutor(node.type)
       await publish(
            workflowChannel().nodestatus({
                nodeId,
                status:"loading"
            })
        )
      try {
            context  = await executor({
        data:node.data as Record<string,unknown>,
        nodeId ,
        context,
        step,
        publish

      })
       await publish(
            workflowChannel().nodestatus({
                nodeId,
                status:"success"
            })
        )
      } catch (error){
       await publish(
            workflowChannel().nodestatus({
                nodeId,
                status:"success"
            })
        )
    throw error;
      }
  
    }
  return {
    workflowid,
    result:context,
  }
  }
);
