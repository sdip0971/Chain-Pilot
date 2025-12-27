"use client";
import type { Workflow } from "@prisma/client"
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
import { useWorkFlowParams } from "@/hooks/use-workflow-params";
import useSuspenseWorkFlows, {
  useCreateWorkflows,
  useRemoveWorkflows,
} from "@/hooks/use-workflows";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import React, { Children } from "react";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
export function WorkFlowSearch() {
  const [params, setParams] = useWorkFlowParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search WorkFlow"
    />
  );
}
function WorkflowList() {
  const workflows = useSuspenseWorkFlows();
  if (workflows.data.items.length == 0) {
    return <WorkFLowEmpty />;
  }

  return (
    <div>
      <EntityList
        items={workflows.data.items}
        getKey={(item) => item.id}
        renderItem={(workflow) => <WorkflowItem data={workflow} />}
        emptyView={<WorkFLowEmpty />}
      />
    </div>
  );
}

export default WorkflowList;
export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const { modal, handleError } = useUpgradeModal();
  const createWorkflow = useCreateWorkflows();
  const router = useRouter();
  const handleCreate = () => {
    const mutation = createWorkflow;
    mutation.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        console.log(error);
        handleError(error);
      },
    });
  };

  return (
    <>
      {modal}
      <EntityHeader
        title="Workflows"
        description="Create and manage Workflows"
        onNew={handleCreate}
        newButtonLabel="New WorkFlow"
        disabled={disabled}
        isCreating={false}
      />
    </>
  );
};
export const WorkflowPagination = () => {
  const workflow = useSuspenseWorkFlows();
  const [params, setParams] = useWorkFlowParams();
  return (
    <EntityPagination
      disabled={workflow.isFetching}
      totalPages={workflow.data.totalPages}
      page={params.page}
      onPageChange={(page) => {
        setParams({ ...params, page:page });
      }}
    />
  );
};

export const WorkFLowLoading = () => {
  return <LoadingView entity="workflows" />;
};
export const WorkFLowError = () => {
  return <ErrorView message="Error Loading workflows" />;
};
export const WorkFLowEmpty = () => {
  const createWorkflow = useCreateWorkflows();
  const { handleError, modal } = useUpgradeModal();
  const router = useRouter()
  const handleCreate = () => {
    createWorkflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
    });
  };
  return (
    <>
      {modal}{" "}
      <EmptyView
        onNew={handleCreate}
        message="You haven't created any workflow yet. Get started by creating your first"
      />
    </>
  );
};
export const WorkFlowContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowHeader />}
      search={<WorkFlowSearch />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  );
};
export const WorkflowItem =   ({data}: {data:Workflow})=>{
  const removeWorkflow = useRemoveWorkflows();
  const handleRemove = ()=>{
    return removeWorkflow.mutate({id:data.id})
  }
return (
  <EntityItem
    href={`/workflows/${data.id}`}
    title={data.name}
    subtitle={<>Updated {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
    &bull; Created{" "}{formatDistanceToNow(data.createdAt,{addSuffix:true})} </>}
    image={
      <div className="size-8  flex items-center justify-center">
        <WorkflowIcon className="size-5 text-muted-foreground" />
      </div>
    }
    isRemoving ={removeWorkflow.isPending}
    onRemove={handleRemove}
  />
);
}