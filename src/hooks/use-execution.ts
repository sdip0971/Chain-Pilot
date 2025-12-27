import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Erica_One } from "next/font/google";
import { redirect, useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

import { useCredentialparams } from "./use-credential-params";
import { CredentialsType } from "@prisma/client";
import { useExecutionparams } from "./use-execution-params";

const useSuspenseExecution = () => {
  const [params, setParams] = useExecutionparams();
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};
export default useSuspenseExecution;


export const useSuspenseIndividualExecution = (executionId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.executions.getOne.queryOptions({ id: executionId })
  );
};




