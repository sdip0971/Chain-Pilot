import { requireAuth } from "@/lib/auth-utils";
import workflows, { WorkFlowContainer } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/servers/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react";
import WorkflowList from "@/features/workflows/components/workflows";

export default async function WorkflowsPage() {
  await requireAuth()
  prefetchWorkflows();
  
  return (
    <WorkFlowContainer>
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<p>Loading!</p>}></Suspense>
        <WorkflowList/>
      </ErrorBoundary>
    </HydrateClient>
    </WorkFlowContainer>
  );
}