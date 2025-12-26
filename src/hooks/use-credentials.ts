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
import { CredentialsType } from "@/generated/prisma/enums";

const useSuspenseCredentials = () => {
  const [params, setParams] = useCredentialparams();
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};
export default useSuspenseCredentials;
export const useCreateCredentials = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const trpc = useTRPC();
  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credentials "${data.name}" created`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        router.push("/credentials");
      },
      onError: (error) => {
        toast.error(`Failed to create credential : ${error.message}`);
      },
    })
  );
};
export const useRemoveCredentials = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" removed`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (error) => {
        toast.error(`Failed to remove credential : ${error.message}`);
      },
    })
  );
};
export const useSuspenseIndividualCredentials = (credentialId: string) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({ id: credentialId })
  );
};

export const useUpdateCredentials = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credentials "${data.name}" updated`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({})
        );
        if (data?.id) {
          queryClient.invalidateQueries(
            trpc.credentials.getOne.queryOptions({ id: data.id })
          );
        }
      },
      onError: (error) => {
        toast.error(`Failed to edit credential: ${error.message}`);
      },
    })
  );
};


export const useCredentialsByType = (type: CredentialsType) => {
  const trpc = useTRPC();

  const query = useQuery({
    // We fetch a large page size to ensure we get all available credentials for the dropdown
    ...trpc.credentials.getMany.queryOptions({
      page: 1,
      pageSize: 100,
    }),
    // We filter the results on the client side to ensure we only return the requested type
    select: (data) => ({
      ...data,
      items: data.items.filter((item) => item.type === type),
    }),
  });

  return {
    ...query,
    // We map isLoading to the specific name used in your component
    isLoadingCredentials: query.isLoading,
  };
};