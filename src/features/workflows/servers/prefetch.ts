import type { inferInput } from "@trpc/tanstack-react-query";
import {prefetch,trpc} from "@/trpc/server"
import { workflowParamsLoader } from "./params-loader";
type Input = inferInput<typeof trpc.workflows.getMany> 
export const prefetchWorkflows = (params:Input)=>{

    return prefetch(trpc.workflows.getMany.queryOptions(params))
}
export const prefetchOneWorkflow = (id:string)=>{
      return prefetch(trpc.workflows.getOne.queryOptions({id:id}));
}