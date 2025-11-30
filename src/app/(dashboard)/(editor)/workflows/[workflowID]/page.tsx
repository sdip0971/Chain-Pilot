
import { Editor, EditorError, EditorHeader, EditorLoading } from "@/features/editor/components/editor";
import { WorkFLowError, WorkFLowLoading } from "@/features/workflows/components/workflows";
import { prefetchOneWorkflow } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient, prefetch } from "@/trpc/server";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
    params: {
        workflowID: string;
    };
}
export default async function WorkFlowPage({ params }:{
    params : Promise<{workflowID:string}>
}) {
  
      await requireAuth()
      const {workflowID} = await params
      console.log(workflowID)
      if(!workflowID){
        throw new Error("Workflow ID is required")
      }
     await prefetchOneWorkflow(workflowID)
return <>
<HydrateClient>
    <ErrorBoundary fallback= { <EditorError/>}>
   <Suspense fallback= {<EditorLoading/>}>

   <EditorHeader workflowId = {workflowID} />
   <main className="flex-1">
    <Editor workflowId={workflowID} />
   </main>
   
   </Suspense>
    </ErrorBoundary>
</HydrateClient>
</>;
    }