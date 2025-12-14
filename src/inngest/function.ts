import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./topological-sort";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
  },
  {
    event: "workflows/execute.workflow",
  },
  async ({ event, step }) => {
    const workflowid = event.data.workflowId
    if(!workflowid){
      throw new NonRetriableError("Workflow Id is missing")
    }
    await step.sleep("test", "5s");

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
      
    }
  
  
  )
  }
);
