import { useTRPC } from "@/trpc/client"
import {  useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Erica_One } from "next/font/google";
import { useRouter } from "next/navigation";
import { Suspense } from "react"
import { toast } from "sonner";

const useSuspenseWorkFlows = ()=>{
    const trpc = useTRPC();
    
return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
}
export default useSuspenseWorkFlows
export const useCreateWorkflows = async()=>{
const router = useRouter()
const queryClient = useQueryClient()
const trpc = useTRPC()
return useMutation(trpc.workflows.create.mutationOptions({
    onSuccess:(data)=>{
        toast.success(`Workflow "${data.name}" created`)
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions());
        router.push(`/workflows/${data.id}`)
        
    },
    onError :(error)=>{
        toast.error(`Failed to create workflow : ${error.message}`)
    }
}))
}