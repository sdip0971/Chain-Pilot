 "use client";
import type {  Credentials, Workflow } from "@prisma/client"
import { CredentialsType } from "@prisma/client";
import EntityHeader, {
  EmptyView,
  EntityContainer,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/ui/mycomponents/entity-components";
import EntityComponents from "@/components/ui/mycomponents/entity-components";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useUpgradeModal } from "@/hooks/use-upgrade-modals";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import React, { Children } from "react";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import useSuspenseCredentials, { useCreateCredentials, useRemoveCredentials } from "@/hooks/use-credentials";
import { useCredentialparams } from "@/hooks/use-credential-params";

export function CredentialsSearch() {
  const [params, setParams] = useCredentialparams()
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
}
function CredentialsList() {
  const credentials = useSuspenseCredentials()
  if (credentials.data.items.length == 0) {
    return (

        <CredentialsEmpty />
    
    );
  }

  return (
    <div>
      <EntityList
        items={credentials.data.items}
        getKey={(credentials) => credentials.id}
        renderItem={(credential) => <CredentialItem data={credential} />}
        emptyView={<CredentialsEmpty />}
      />
    </div>
  );
}

export default CredentialsList;
export const CredentialHeader = ({ disabled }: { disabled?: boolean }) => {
       const router = useRouter();
       const {handleError,modal} = useUpgradeModal()

       const handleCreate = () => {
         router.push(`/credentials/new`);
       };
  return (
    <>
      <EntityHeader
        title="Credentials"
        description="Create and manage Credentials"
        newButtonHref="/credentials/new"
        newButtonLabel="New Credentials"
        disabled={disabled}
      />
    </>
  );
  
};
export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialparams();
  return (
    <EntityPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={params.page}
      onPageChange={(page) => {
        setParams({ ...params, page:page });
      }}
    />
  );
};

export const CredentialsLoading = () => {
  return <LoadingView entity="Credentials" />;
};
export const CredentialError = () => {
  return <ErrorView message="Error Loading credentials" />;
};
export const CredentialsEmpty = () => {
    const router = useRouter()
  const handleCreate = () => {router.push(`/credentials/new`);};
  return (
    <>
      <EmptyView
        onNew={handleCreate}
        message="You haven't created any credential yet. Get started by creating your first"
      />
    </>
  );
};
export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

type CredentialListProps = Pick<Credentials, "id" | "createdAt"|"updatedAt"|"name" | "type">;

const credentialLogoMapping = {
    [CredentialsType.OPENAI]: "/icons/openai-svgrepo-com.svg",
     [CredentialsType.ANTHROPIC]:"/icons/claude.png",
      [CredentialsType.GEMINI]:"/Google_Gemini_logo_2025.svg",
};
export const CredentialItem =   ({data}: {data:CredentialListProps})=>{
  const removeCredential = useRemoveCredentials();
  const handleRemove = ()=>{
    return removeCredential.mutate({id:data.id})
  }
return (
  <EntityItem
    href={`/credentials/${data.id}`}
    title={data.name}
    subtitle={
      <>
        Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
        &bull; Created{" "}
        {formatDistanceToNow(data.createdAt, { addSuffix: true })}{" "}
      </>
    }
    image={
      <div className="size-8  flex items-center justify-center">
        <img
          src={credentialLogoMapping[data.type]}
          alt="Descriptive text"
          className="rounded-xl border border-gray-200 shadow-lg object-cover w-full h-auto transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>
    }
    isRemoving={removeCredential.isPending}
    onRemove={handleRemove}
  />
);
}
export const CredentialContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};