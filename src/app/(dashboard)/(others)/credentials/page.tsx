
import CredentialsList, { CredentialContainer, CredentialError, CredentialsLoading } from "@/features/credentials/components/credentials";
 import { credentialParamLoader } from "@/features/credentials/server/params-loader";
 import { prefetchCredentials } from "@/features/credentials/server/prefetch";
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
 
   const params = await credentialParamLoader(searchParams);
   prefetchCredentials(params);
 
   return (
     <CredentialContainer>
       <HydrateClient>
         <ErrorBoundary fallback={<CredentialError/>}>
           <Suspense fallback={<CredentialsLoading/>}>
             <CredentialsList />
           </Suspense>
         </ErrorBoundary>
       </HydrateClient>
     </CredentialContainer>
   );
 };
 
 export default Page;
 