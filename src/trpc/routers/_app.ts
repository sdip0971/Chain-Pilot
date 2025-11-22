import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { workflowsRouter } from '@/features/workflows/servers/router';
export const appRouter = createTRPCRouter({
  workflows: workflowsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;