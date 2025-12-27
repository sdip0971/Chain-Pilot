"use client";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { CredentialsType } from "@prisma/clients";
import { useCredentialsByType } from "@/hooks/use-credentials";

const availableModels = [
  "gemini-3-flash",
  "gemini-3-pro",
  "gemini-3-flash-thinking",
  "gemini-3-flash-preview",
  "models/gemini-2.5-flash",
  "models/gemini-2.5-pro",
  "models/gemini-2.5-flash-lite",
  "models/gemini-flash-latest",
  "models/gemini-pro-latest",
] as const;

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with letter/underscore and contain only letters, numbers, underscores",
    })
    .optional()
    .or(z.literal("")),
  imageUrl: z.string().optional(),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User Prompt is required"),
  model: z.enum(availableModels),
  credentialId:z.string().min(1,"Credential is required"),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  onSubmit?: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;

}

export const GeminiDialog = ({
  open,
  onSubmit,
  onOpenChangeAction,
  defaultValues,
}: Props) => {
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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const {data:credentials,isLoadingCredentials}=useCredentialsByType(CredentialsType.GEMINI)
  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credentialId:defaultValues?.credentialId,
      variableName: defaultValues?.variableName ?? "",
      model: defaultValues?.model,
      systemPrompt: defaultValues?.systemPrompt ?? "",
      userPrompt: defaultValues?.userPrompt ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
      
    },
  });

  useEffect(() => {
     if (open) {
      form.reset({
        credentialId: defaultValues?.credentialId,
        variableName: defaultValues?.variableName ?? "",
        model: defaultValues?.model,
        systemPrompt: defaultValues?.systemPrompt ?? "",
        userPrompt: defaultValues?.userPrompt ?? "",
        imageUrl: defaultValues?.imageUrl ?? "",
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = (values: GeminiFormValues) => {
    onSubmit?.(values);
    onOpenChangeAction(false);
  };
 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (!file) return;


   if (file.size > 2 * 1024 * 1024) {
     alert("File is too large! Please choose an image under 2MB.");
     return;
   }

   setIsProcessingImage(true);
   const reader = new FileReader();

   reader.onloadend = () => {
     
     const base64String = reader.result as string;
     form.setValue("imageUrl", base64String); 
     setIsProcessingImage(false);
   };

   reader.readAsDataURL(file);
 };
  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Gemini AI</DialogTitle>
          <DialogDescription>
            Configure the Google Gemini model, prompts, and output variable.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="geminiResponse" {...field} />
                  </FormControl>
                  <FormDescription>
                    Access result via: {"{{geminiResponse}}"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Model Selection */}
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image Input (Optional)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="cursor-pointer file:text-foreground"
                          onChange={handleFileChange}
                          disabled={isProcessingImage}
                        />
                        {isProcessingImage && (
                          <Loader2 className="animate-spin h-4 w-4" />
                        )}
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Or enter URL / {{variable}} here..."
                          {...field}
                          className="pr-10 truncate font-mono text-xs"
                        />
                        {field.value && field.value.startsWith("data:") && (
                          <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                            Base64
                          </span>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload an image or paste a URL.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="You are a helpful assistant..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summarize this text: {{prevNode.data}}"
                      className="min-h-30"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Supports Handlebars syntax for variables.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentialId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential (API Key)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoadingCredentials}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingCredentials
                              ? "Loading keys..."
                              : "Select a Gemini Key"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {credentials?.items.map((cred) => (
                        <SelectItem key={cred.id} value={cred.id}>
                          <div className="flex items-center gap-2">
                   
                            <img
                              src="/Google_Gemini_logo_2025.svg"
                              className="w-4 h-4"
                              alt="Gemini"
                            />
                            {cred.name}
                          </div>
                        </SelectItem>
                      ))}

                      {credentials?.items.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          No Gemini keys found. <br />
                          <a
                            href="/credentials"
                            className="underline text-primary"
                          >
                            Create one first
                          </a>
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
