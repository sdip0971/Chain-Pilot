import type { inferInput } from "@trpc/tanstack-react-query";
import {prefetch,trpc} from "@/trpc/server"

type Input = inferInput<typeof trpc.credentials.getMany> 
export const prefetchExecution = (params:Input)=>{

    return prefetch(trpc.executions.getMany.queryOptions(params))
}
export const prefetchOneExecution = (id:string)=>{
      return prefetch(trpc.executions.getOne.queryOptions({id:id}));
}