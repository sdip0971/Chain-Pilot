import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import {generateSlug} from "random-word-slugs"
import prisma from "@/lib/db";
import z, { string } from "zod";
import type {Node,Edge} from "@xyflow/react"
import { pagination } from "@/config/constants";
import { CredentialsType, NodeType } from "@/generated/prisma/enums";
import type {Connection } from "@/generated/prisma/client";
import { inngest } from "@/inngest/client";
export const CredentialsRouter = createTRPCRouter({
  create: premiumProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialsType),
        value: z.string().min(1, "Values is required"),
      })
    )
    .mutation(async ({ input, ctx }: any) => {
      const { name, value, type } = input;
      return prisma.credentials.create({
        data: {
          name: generateSlug(3),
          userId: ctx.auth.user.id,
          type,
          value,
        },
      });
    }),
  remove: premiumProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }: any) => {
      return prisma.credentials.delete({
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
        name: z.string().min(1, "Name is required"),
        type: z.string().min(1, "Type is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const { id, name,type,value } = input;
      const credentials = await prisma.credentials.findUniqueOrThrow({
        where: {
          id,
          userId: ctx.auth.user.id,
        },
      });

      return await prisma.$transaction(
        async (tx) => {
          await tx.credentials.update({
            where: { id },
            data: { updatedAt: new Date() },
          });
          return prisma.credentials.update({
            where:{
              id,
              userId:ctx.auth.user.id
            },data:{
              name,
              type,
              value
            }

          })
        }
      );
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
      return  await prisma.credentials.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
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
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }: any) => {
      const { page, pageSize, search } = input;
      const items = await prisma.credentials.findMany({
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
        select:{
          id:true,
          name:true,
          type:true,
          createdAt:true,
          updatedAt:true,
          
        }
      });
      const totalCount = await prisma.credentials.count({
        where: {
          userId: ctx.auth.user.id,
          name: {
            contains: search,
            mode: "insensitive",
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
    getByType:protectedProcedure.input(z.object({type:z.enum(CredentialsType)})).query(async({input,ctx})=>{
      const {type} = input
      return prisma.credentials.findMany({
        where:{
          type:type,
          userId:ctx.auth.user.id},
        orderBy:{
          updatedAt:"desc"
        }

      })
    })
});