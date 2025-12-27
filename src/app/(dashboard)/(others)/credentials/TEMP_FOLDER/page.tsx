import { CredentialView } from "@/features/credentials/components/credential";
import CredentialsList, { CredentialError } from "@/features/credentials/components/credentials";
import { credentialParamLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials, prefetchOneCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
params: Promise<{
  credentialId :string
}>;
};

const Page = async ({ params }: Props) => {
  await requireAuth();

  const {credentialId} = await params;
  prefetchOneCredential(credentialId)

  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
          <ErrorBoundary fallback={<CredentialError />}>
            <Suspense>
              <CredentialView credentialId={credentialId} />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </div>
    </div>
  );
};

export default Page;
