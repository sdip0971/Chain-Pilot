
 import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { ExecutionView } from "@/features/executions/components/execution-history/execution";

import ExecutionsList, { ExecutionContainer, ExecutionsError, ExecutionsLoading } from "@/features/executions/components/execution-history/executions";
import { ExecutionParamLoader } from "@/features/executions/server/params-loader";
import { prefetchExecution, prefetchOneExecution } from "@/features/executions/server/prefetch";
 import { requireAuth } from "@/lib/auth-utils";
 import { HydrateClient } from "@/trpc/server";
 import { SearchParams } from "nuqs";
 import { Suspense } from "react";
 import { ErrorBoundary } from "react-error-boundary";
 
 type Props = {
   params : Promise<{
    executionId : string
   }>;
 };
 
 const Page = async ({ params }: Props) => {
   await requireAuth();

 
    const {executionId} = await params;
    prefetchOneExecution(executionId)

   return (
     <div className="p-4 md:py-6 h-full">
       <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
         <HydrateClient>
           <ErrorBoundary fallback={<ExecutionsError />}>
             <Suspense fallback>
               <ExecutionView executionId={executionId} />
             </Suspense>
           </ErrorBoundary>
         </HydrateClient>
       </div>
     </div>
   );
 };
 
 export default Page;