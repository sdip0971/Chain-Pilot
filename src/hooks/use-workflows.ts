
import { useTRPC } from "@/trpc/client"
import {  useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Erica_One } from "next/font/google";
import { useRouter } from "next/navigation";
import { Suspense } from "react"
import { toast } from "sonner";
import { useWorkFlowParams } from "./use-workflow-params";

const useSuspenseWorkFlows = ()=>{
    const [params, setParams] = useWorkFlowParams();
    const trpc = useTRPC();
    
return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}
export default useSuspenseWorkFlows
export const useCreateWorkflows = ()=>{
const queryClient = useQueryClient()
const trpc = useTRPC()
return useMutation(trpc.workflows.create.mutationOptions({
    onSuccess:(data)=>{
        toast.success(`Workflow "${data.name}" created`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
    },
    onError :(error)=>{
        toast.error(`Failed to create workflow : ${error.message}`)
    }
}))
}
export const useRemoveWorkflows = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" removed`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
         queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({id:data.id}));
        
      },
      onError: (error) => {
        toast.error(`Failed to remove workflow : ${error.message}`);
      },
    })
  );
};
export const useSuspenseIndividualWorkFlow = (workflowId: string) => {

  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id:workflowId}));
};
export const useUpdateWorkflows = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" updated`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to edit workflow name: ${error.message}`);
      },
    })
  );
};

