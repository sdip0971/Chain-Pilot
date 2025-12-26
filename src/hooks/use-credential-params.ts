import { CredentialParams } from "@/features/workflows/params"

import {useQueryStates} from "nuqs"
export const useCredentialparams = ()=>{
    return useQueryStates(CredentialParams);
}