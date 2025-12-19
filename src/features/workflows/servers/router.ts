import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db";
import z, { string } from "zod";
import type {Node,Edge} from "@xyflow/react"
import { pagination } from "@/config/constants";
import { NodeType } from "@/generated/prisma/enums";
import type {Connection } from "@/generated/prisma/client";
import { inngest } from "@/inngest/client";
export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }: any) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
        Nodes: {
          create: {
            type: NodeType.INITIAl,
            position: { x: 0, y: 0 },
            name: NodeType.INITIAl,
          },
        },
      },
    });
  }),
  remove: premiumProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }: any) => {
      return prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  update: premiumProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({
              x: z.number(),
              y: z.number(),
            }),
            data: z.record(z.string(), z.any()).optional(),
          })
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const { id, nodes, edges } = input;
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
      });

      return await prisma.$transaction(async (tx) => {
        await tx.node.deleteMany({
          where: { workflowId: id },
        }); // delete all previous nodes and transactions
        
        await tx.node.createMany({
          data: nodes.map((node: Node) => ({
            id: node.id,
            workflowId: id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        }); // creating all the nodes present in react flow not a for loop and combination of create is slower than createMnay
        // so instead of doing for(node in nodes) tx.node.create() we use createMany

        await tx.connection.createMany({
          data: edges.map((edge: Edge) => ({
            workflowId: id,
            SourceNodeId: edge.source,
            DestinationNodeId: edge.target,
            fromOutput: edge.sourceHandle,
            toInput: edge.targetHandle,
            target:edge.target
          })),
        });

        await tx.workflow.update({
          where: { id },
          data: {
            updatedAt: new Date(),
          },
        });
        return workflow;
      });
    }),
  updateName: premiumProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }: any) => {
      return prisma.workflow.update({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  getOne: premiumProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }: any) => {
      const workflow = await prisma.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
        include: { Nodes: true, Connections: true },
      });
      if (!workflow) {
        throw new Error("Workflow not found");
      }
      // Transforming Server Nodes to ReactFlow Nodes
      const nodes: Node[] = workflow.Nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position as { x: number; y: number },
        data: (node.data as Record<string, unknown>) || {},
      }));
      // Transforming Server Connections to ReactFlow Edges
      const edges: Edge[] = workflow.Connections.map((connection) => ({
        id: connection.id,
        source: connection.SourceNodeId,
        target: connection.DestinationNodeId,
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      })); 

      return {
        ...workflow,
        nodes,
        edges,
      };
    }),
  getMany: premiumProcedure
    .input(
      z.object({
        page: z.number().default(pagination.Default_Page),
        pageSize: z
          .number()
          .min(pagination.MIN_Page_Size)
          .max(pagination.MAX_Page_Size)
          .default(pagination.Default_Page_Size),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }: any) => {
      const { page, pageSize, search } = input;
      const items = await prisma.workflow.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: {
          userId: ctx.auth.user.id,
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      const totalCount = await prisma.workflow.count({
        where: {
          userId: ctx.auth.user.id,
          // name: {
          //   contains: search,
          //   mode: "insensitive",
          // },
        },
      });

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      return {
        items,
        page,
        hasNextPage,
        hasPrevPage,
        totalCount,
        totalPages,
        pageSize,
      };
    }),
    execute: premiumProcedure.input(z.object({id:z.string()})).mutation(async({ctx, input}:any)=>{
         const workflow = await prisma.workflow.findUniqueOrThrow({
          where:{
            id:input.id,
            userId : ctx.auth.user.id
          }
         })
         await inngest.send({
          name : "workflow/execute.workflow",
          data : {
            workflowId : input.id
          } 
         })
         return workflow;

    })
});