import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db";
import z, { string } from "zod";
import type {Node,Edge} from "@xyflow/react"
import { pagination } from "@/config/constants";
import { NodeType } from "@prisma/clients";
import type {Connection } from "@prisma/client";
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

        
        await tx.workflow.update({
    where: { id },
    data: { updatedAt: new Date() },
  });
  
        await tx.node.deleteMany({
    where: { workflowId: id },
  }); // delete all previous nodes and transactions

//   React Strict Mode: In development, React renders components twice. If your save function triggers during a render cycle, it might capture the state mid-update, resulting in duplicates.
// Rapid State Updates: If you drag a node quickly, React Flow fires multiple onNodesChange events. Your auto-save hook might grab a version of the nodes array that has transient duplicates before React finishes reconciling the state.
// Race Conditions: Two "save" requests might fire milliseconds apart, and due to network latency, they might get merged or processed in a way that creates a payload with redundant data.
  const uniqueNodes = nodes.filter((node: Node, index: number, self: Node[]) =>
    index === self.findIndex((t) => t.id === node.id)
  );
  await tx.node.createMany({
          data: uniqueNodes.map((node: Node) => ({
            id: node.id,
            workflowId: id,
            name: node.type || "unknown",
            type: node.type as NodeType,
            position: node.position,
            data: node.data || {},
          })),
        }); // creating all the nodes present in react flow not a for loop and combination of create is slower than createMnay
        // so instead of doing for(node in nodes) tx.node.create() we use createMany


        const cleanEdges = edges.map((edge:Edge) => ({
  ...edge,
  sourceHandle: edge.sourceHandle || "main", 
  targetHandle: edge.targetHandle || "main",
}));
       const uniqueEdges = cleanEdges.filter((edge: Edge, index: number, self: Edge[]) =>
    index === self.findIndex((t: Edge) => (
      t.source === edge.source &&
      t.target === edge.target &&
      t.sourceHandle === edge.sourceHandle &&
      t.targetHandle === edge.targetHandle
    ))
  );  


        await tx.connection.createMany({
          data: uniqueEdges.map((edge: Edge) => ({
            workflowId: id,
            SourceNodeId: edge.source,
            DestinationNodeId: edge.target,
            fromOutput: edge.sourceHandle,
            toInput: edge.targetHandle,
            target: edge.target
          })),
        });

      await tx.workflow.update({
        where: { id },
        data: {
          updatedAt: new Date(),
        },
      });
      return workflow;
    }, {
maxWait: 5000,
timeout: 20000,
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
        sourceHandle: connection.fromOutput === "main" ? null : connection.fromOutput ,
        targetHandle: connection.toInput === "main" ? null : connection.toInput ,
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