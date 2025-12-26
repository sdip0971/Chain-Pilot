"use client";

import { CredentialsType } from "@/generated/prisma/enums";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpgradeModal } from "@/hooks/use-upgrade-modals";
import useSuspenseCredentials, {
  useCreateCredentials,
  useSuspenseIndividualCredentials,
  useUpdateCredentials,
} from "@/hooks/use-credentials";

// Assuming standard Shadcn/UI component paths based on the video context
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react"; // Common icon for loading states

// Schema Definition
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(CredentialsType), // Updated to use the Enum directly
  value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialsType;
    value: string;
  };
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();

  const createCredential = useCreateCredentials();
  const updateCredential = useUpdateCredentials();
  const { handleError, modal } = useUpgradeModal();

  const isEdit = !!initialData?.id;


  const credentialTypeOptions = [
    {
      value: CredentialsType.OPENAI,
      label: "OpenAI",
      logo: "/icons/openai-svgrepo-com.svg",
    },
    {
      value: CredentialsType.ANTHROPIC,
      label: "Anthropic",
      logo: "/icons/claude.png",
    },
    {
      value: CredentialsType.GEMINI,
      label: "Gemini",
      logo: "/Google_Gemini_logo_2025.svg",
    },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialsType.OPENAI,
      value: "",
    },
  });

  const isLoading = createCredential.isPending || updateCredential.isPending;


  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit && initialData?.id) {
        await updateCredential.mutateAsync({
          id: initialData.id,
          ...values,
        });
      } else {
        await createCredential.mutateAsync(values, {
          onError: (error) => {
            handleError(error);
          },
        });
      }

    } catch (error) {
      console.error("Something went wrong", error);
    }
  };

  return (
    <>
    {modal}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Credential" : "Create Credential"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Update your API key or credential details"
              : "Add a new API key or credential to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Credential" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {credentialTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <img
                                src={option.logo}
                                alt={option.label}
                                className="w-4 h-4"
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input placeholder="sk-..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEdit ? "Update Credential" : "Create Credential"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export const CredentialView= ({credentialId}:{credentialId:string})=>{
  const params= useParams();
  const { data: credential } = useSuspenseIndividualCredentials(credentialId);
  return <CredentialForm initialData={credential ?? undefined}/>
  
}