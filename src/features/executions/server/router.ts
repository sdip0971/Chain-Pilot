import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db";
import z, { string } from "zod";
import type {Node,Edge} from "@xyflow/react"
import { pagination } from "@/config/constants";
import { CredentialsType, NodeType } from "@prisma/client";
import type {Connection } from "@prisma/client";
import { inngest } from "@/inngest/client";
export const ExecutionRouter = createTRPCRouter({
  getOne: premiumProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }: any) => {
      return await prisma.execution.findUnique({
        where: {
          id: input.id,
          workflow: { userId: ctx.auth.user.id },
        },
        include: {
          workflow: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
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
      })
    )
    .query(async ({ ctx, input }: any) => {
      const { page, pageSize} = input;
      const items = await prisma.execution.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where: {
          workflow: { userId: ctx.auth.user.id },
        },
        orderBy: {
          startedAt: "desc",
        },
        include :{
          workflow:{
            select:{
              id:true,
              name:true,
            }
          }
        }
      });
      const totalCount = await prisma.execution.count({
        where: {
          workflow: {
            userId: ctx.auth.user.id,
            name: {
              mode: "insensitive",
            },
          },
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
  
});