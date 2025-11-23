import { workflowParams } from "@/features/workflows/params"

import {useQueryStates} from "nuqs"
export const useWorkFlowParams = ()=>{
    return useQueryStates(workflowParams)
}