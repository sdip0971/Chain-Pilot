import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db";
import z from "zod";
export const workflowsRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }: any) => {
    return prisma.workflow.create({
      data: {
        name: generateSlug(3),
        userId: ctx.auth.user.id,
      },
    });
  }),
  remove: protectedProcedure
    .input(z.object({ id: z.string }))
    .mutation(async ({ ctx, input }: any) => {
      return prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  updateName: protectedProcedure
    .input(z.object({ id: z.string, name: z.string() }))
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
  getOne: protectedProcedure
    .input(z.object({ id: z.string }))
    .query(async ({ ctx, input }: any) => {
      return prisma.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
      });
    }),
  getMany: protectedProcedure
    .query(async ({ ctx, input }: any) => {
      return prisma.workflow.findMany({
        where: {
          userId: ctx.auth.user.id,
        },
      });
    }),
});