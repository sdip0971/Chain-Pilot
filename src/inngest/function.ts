import { NonRetriableError, step } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { getExecutor } from "@/features/executions/lib/execution-registry";
import {
  httpRequestChannel,
  WORKFLOW_CHANNEL_ID,
  workflowChannel,
} from "./channels/workflowChannel";
import { Node } from "@prisma/client";

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    onFailure: async ({ event, step }) => {
      const errorData = event.data.error;
      await step.run("mark-execution-failed-on-crash", async () => {
        const workflowId = event.data.event?.data?.workflowId;
        await prisma.execution.updateMany({
          where: {
            inngestEventId: event.data.event.id,
      
            status: { not: "CANCELLED" },
          },
          data: {
            status: "FAILED",
            error: errorData.message,
            errorStack: errorData.stack,
            completedAt: new Date(),
          },
        });
      });
    },
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
    const inngestEventId = event.id!;

    const workflowid = event.data.workflowId;
    if (!workflowid || !inngestEventId) {
      throw new NonRetriableError("Workflow Id is missing");
    }

    await publish(
      workflowChannel().workflowstatus({
        workflowId: workflowid,
        status: "running",
      })
    );
    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data: {
          workflowId: workflowid,
          inngestEventId,
          status:"RUNNING"
        },
      });
    });

    try {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: workflowid,
        },
        include: {
          Nodes: true,
          Connections: true,
        },
      });
      const Sortednodes = topologicalSort({
        nodes: workflow.Nodes,
        edges: workflow.Connections,
      });
      const userId = await step.run("find-user-id", async () => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
          where: { id: workflowid },
          select: {
            userId: true,
          },
        });
        return workflow.userId;
      });
      if (!userId) {
        throw new NonRetriableError("User not found");
      }

      let context = event.data.initialData || {};

      for (const node of Sortednodes) {
        const nodeId = node!.id;
        const executor = getExecutor(node!.type);
        await publish(
          workflowChannel().nodestatus({
            nodeId,
            status: "loading",
          })
        );
        try {
          context = await executor({
            data: node?.data as Record<string, unknown>,
            nodeId,
            context,
            step,
            userId,
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
      await step.run("update-execution-success", async () => {
        //  Use updateMany to safely check status
        // This prevents the function from overwriting "CANCELLED" with "SUCCESS"
        await prisma.execution.updateMany({
          where: {
            workflowId: workflowid,
            inngestEventId,
            status: { not: "CANCELLED" },
          },
          data: {
            status: "SUCCESS",
            output: context,
            completedAt: new Date(),
          },
        });
      });
      return {
        workflowid,
        result: context,
      };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      await publish(
        workflowChannel().workflowstatus({
          workflowId: workflowid,
          status: "failed",
          errorMessage: errorMessage,
        })
      );
      await step.run("update-execution-failed", async () => {
        await prisma.execution.updateMany({
          where: {
            workflowId: workflowid,
            inngestEventId,
            status: { not: "CANCELLED" },
          },
          data: {
            status: "FAILED",
            error: errorMessage,
            errorStack: errorStack,
            completedAt: new Date(),
          },
        });
      });
      throw error;
    }
  }
);
export const workflowCancellationHandler = inngest.createFunction(
  { id: "handle-workflow-cancellation" },
  { event: "workflow/cancel.workflow" },
  async ({ event,step, publish }) => {
    const { workflowId,executionId } = event.data;

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
    await Promise.all(
      workflow.Nodes.map((node) =>
        publish({
          channel: WORKFLOW_CHANNEL_ID,
          topic: "nodestatus",
          data: {
            nodeId: node.id,
            status: "cancelled",
          },
        })
      )
    );

      await step.run("update-execution-cancelled", async () => {
        if(executionId){
        await prisma.execution.update({
          where: {
            id: executionId,
          },
          data: {
            status: "CANCELLED",
            completedAt: new Date(),
          },
        });
   }
   
  });
   
})