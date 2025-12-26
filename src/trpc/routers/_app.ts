import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import { workflowsRouter } from '@/features/workflows/servers/router';
import { CredentialsRouter } from '@/features/credentials/server/router';
import { ExecutionRouter } from '@/features/executions/server/router';
export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials:CredentialsRouter,
  executions : ExecutionRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;