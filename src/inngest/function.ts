import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/executions/lib/execution-registry";
import {
  httpRequestChannel,
  WORKFLOW_CHANNEL_ID,
  workflowChannel,
} from "./channels/workflowChannel";
import { Node } from "@/generated/prisma/client";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    cancelOn: [
      {
        event: "workflow/cancel.workflow",
        match: "data.workflowId",
      },
    ],
  },

  {
    event: "workflow/execute.workflow",
    channels: [httpRequestChannel(), workflowChannel()],
  },
  async ({ event, step, publish }) => {
    const workflowid = event.data.workflowId;
    if (!workflowid) {
      throw new NonRetriableError("Workflow Id is missing");
    }

    await publish(
      workflowChannel().workflowstatus({
        workflowId: workflowid,
        status: "running",
      })
    );

    try {
      const Sortednodes = await step.run("prepare-workflow", async () => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: {
            id: workflowid,
          },
          include: {
            Nodes: true,
            Connections: true,
          },
        });

        return topologicalSort({
          nodes: workflow.Nodes,
          edges: workflow.Connections,
        });
      });
      let context = event.data.initialData || {};
      console.log(Sortednodes);
      for (const node of Sortednodes) {
        const nodeId = node.id;
        const executor = getExecutor(node.type);
        await publish(
          workflowChannel().nodestatus({
            nodeId,
            status: "loading",
          })
        );
        try {
          context = await executor({
            data: node.data as Record<string, unknown>,
            nodeId,
            context,
            step,
          });
          await publish(
            workflowChannel().nodestatus({
              nodeId,
              status: "success",
            })
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          await publish(
            workflowChannel().nodestatus({
              nodeId,
              status: "error",
              errorMessage: errorMessage,
            })
          );
          throw error;
        }
      }
      await publish(
        workflowChannel().workflowstatus({
          workflowId: workflowid,
          status: "completed",
        })
      );
      return {
        workflowid,
        result: context,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await publish(
        workflowChannel().workflowstatus({
          workflowId: workflowid,
          status: "failed",
          errorMessage: errorMessage,
        })
      );
      throw error;
    }
  }
);
export const workflowCancellationHandler = inngest.createFunction(
  { id: "handle-workflow-cancellation" },
  { event: "workflow/cancel.workflow" },
  async ({ event, publish }) => {
    const { workflowId } = event.data;

    // 1. Update Workflow Status
    await publish(
      workflowChannel().workflowstatus({
        workflowId: workflowId,
        status: "cancelled",
      })
    );

    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId },
      include: { Nodes: true },
    });

    if (!workflow) return;
     const events = [
       {
         channel: WORKFLOW_CHANNEL_ID,
         topic: "workflowstatus",
         data: {
           workflowId: workflowId,
           status: "cancelled",
         },
       },
       ...workflow.Nodes.map((node) => ({
         channel: WORKFLOW_CHANNEL_ID,
         topic: "nodestatus",
         data: {
           nodeId: node.id,
           status: "cancelled",
         },
       })),
     ];
  if (events.length > 0) {
    await publish(events as any)
  }
})