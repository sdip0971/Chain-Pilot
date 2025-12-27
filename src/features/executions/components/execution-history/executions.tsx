 "use client";
import type {  Credentials, Execution, ExecutionStatus, Workflow } from "@prisma/client"
import { CredentialsType } from "@prisma/clients";
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
import { CheckCircle2, Loader2, WorkflowIcon, XCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import useSuspenseCredentials, { useCreateCredentials, useRemoveCredentials } from "@/hooks/use-credentials";
import { useCredentialparams } from "@/hooks/use-credential-params";
import useSuspenseExecution from "@/hooks/use-execution";
import { useExecutionparams } from "@/hooks/use-execution-params";


interface StatusConfigAttrs {
  icon: React.ElementType;
  label: string;
  bg: string;
  text: string;
}

function ExecutionsList() {
  const executions = useSuspenseExecution()
  if (executions.data.items.length == 0) {
    return (

        <ExecutionsEmpty />
    
    );
  }

  return (
    <div>
      <EntityList
        items={executions.data.items}
        getKey={(execution) => execution.id}
        renderItem={(execution) => <ExecutionItem data={execution} />}
        emptyView={<ExecutionsEmpty />}
      />
    </div>
  );
}

export default ExecutionsList;
export const ExecutionsHeader = ({ disabled }: { disabled?: boolean }) => {
   
  return (
    <>
      <EntityHeader
        title="Executions"
        description="View execution history" 
      />
    </>
  );
  
};
export const ExecutionsPagination = () => {
  const executions = useSuspenseExecution();
  const [params, setParams] = useExecutionparams();
  return (
    <EntityPagination
      disabled={executions.isFetching}
      totalPages={executions.data.totalPages}
      page={params.page}
      onPageChange={(page) => {
        setParams({ ...params, page:page });
      }}
    />
  );
};

export const ExecutionsLoading = () => {
  return <LoadingView entity="Executions" />;
};
export const ExecutionsError = () => {
  return <ErrorView message="Error Loading executions" />;
};
export const ExecutionsEmpty = () => {
  return (
    <>
      <EmptyView

        message="No executions to show"
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
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};


const executionStatusConfig: Record<ExecutionStatus, StatusConfigAttrs> = {
  SUCCESS: {
    icon: CheckCircle2,
    label: "Success",
    bg: "bg-emerald-100/60 dark:bg-emerald-900/30",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  FAILED: {
    icon: XCircle,
    label: "Failed",
    bg: "bg-rose-100/60 dark:bg-rose-900/30",
    text: "text-rose-600 dark:text-rose-400",
  },
  RUNNING: {
    icon: Loader2,
    label: "Running",
    bg: "bg-blue-100/60 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
  },
  CANCELLED: {
    icon: XCircle, 
    label: "Cancelled",
    bg: "bg-slate-100/60 dark:bg-slate-900/30",
    text: "text-slate-600 dark:text-slate-400",
  },
};


export const ExecutionItem =   ({data}: {data:Execution & {
    workflow:{
        id:string;
        name:string;
    }
}})=>{
  
    const config =
      executionStatusConfig[data.status as ExecutionStatus] ||
      executionStatusConfig.FAILED;
    const StatusIcon = config.icon;
    const isRunning = data.status === "RUNNING";
      const formStatus = (status: ExecutionStatus) => {
        return status.charAt(0) + status.slice(1);
      };

 const duration = data.completedAt ? Math.round(
    (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime())
 ) : null
 const subtitle = (
<>
{data.workflow.name} &bull; Started{" "}
{formatDistanceToNow(data.startedAt,{addSuffix:true})}
{duration!=null && <>&bull Took {duration}s </>}
</>
 )

return (
  <EntityItem
    href={`/executions/${data.id}`}
    title={formStatus(data.status)}
    subtitle={subtitle}
  image={
        <div
          className={`size-10 flex items-center justify-center rounded-xl transition-transform duration-300 hover:scale-[1.05] ${config.bg}`}
        >
          <StatusIcon
            className={`size-6 ${config.text} ${isRunning ? "animate-spin" : ""}`}
          />
        </div>
        }
  />
);
}
export const ExecutionContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
   
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  );
};