
 import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import ExecutionsList, { ExecutionContainer, ExecutionsError, ExecutionsLoading } from "@/features/executions/components/execution-history/executions";
import { ExecutionParamLoader } from "@/features/executions/server/params-loader";
import { prefetchExecution } from "@/features/executions/server/prefetch";
 import { requireAuth } from "@/lib/auth-utils";
 import { HydrateClient } from "@/trpc/server";
 import { SearchParams } from "nuqs";
 import { Suspense } from "react";
 import { ErrorBoundary } from "react-error-boundary";
 
 type Props = {
   searchParams: Promise<SearchParams>;
 };
 
 const Page = async ({ searchParams }: Props) => {
   await requireAuth();
 
   const params = await ExecutionParamLoader(searchParams);
   prefetchExecution(params);
 
   return (
     <ExecutionContainer>
       <HydrateClient>
         <ErrorBoundary fallback={<ExecutionsError/>}>
           <Suspense fallback={<ExecutionsLoading/>}>
             <ExecutionsList />
           </Suspense>
         </ErrorBoundary>
       </HydrateClient>
     </ExecutionContainer>
   );
 };
 
 export default Page;
 