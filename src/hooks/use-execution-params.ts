import { ExecutionParams } from "@/features/workflows/params"

import {useQueryStates} from "nuqs"
export const useExecutionparams = ()=>{
    return useQueryStates(ExecutionParams);
}