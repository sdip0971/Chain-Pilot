import { NonRetriableError } from "inngest";
import { generateText } from "ai";


import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";

import type { NodeExecutor } from "./execution-registry";
import ky, { Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";


Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  return new Handlebars.SafeString(jsonString);
});


export type MANUAL_TRIGGER_DATA = Record<string, unknown>;
export const manualtriggerexecutor: NodeExecutor<MANUAL_TRIGGER_DATA> = async ({
  context,
  step,
}) => {
  return context
};


export type HTTP_TRIGGER_DATA = {
  variableName: string;
  endpoint: string;
  body?: string;
  method: "GET" | "PUT" | "POST" | "DELETE";
};

export const httprequestexecutor: NodeExecutor<HTTP_TRIGGER_DATA> = async ({
  context,
  step,
  data,
}) => {
  if (!data.endpoint) throw new NonRetriableError("Endpoint is missing");
  if (!data.method) throw new NonRetriableError("Method not configured");

  const result = await step.run("http-request", async () => {
    const method = data.method || "GET";
    const endpoint = Handlebars.compile(data.endpoint)(context);

    const options: KyOptions = { method };

    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      try {
        JSON.parse(resolved);
      } catch (e) {
        throw new NonRetriableError("Body is not valid JSON");
      }
      options.body = resolved;
      options.headers = { "Content-Type": "application/json" };
    }

    const response = await ky(endpoint, options);
    const responseData = await response.json().catch(() => response.text());

    return {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };
  });

  const variableName = data.variableName?.trim() || "httpRequest";
  return { ...context, [variableName]: result };
};
export type GoogleForm_TRIGGER_DATA = Record<string, unknown>;
export const GoogleFormtriggerexecutor: NodeExecutor<
  GoogleForm_TRIGGER_DATA
> = async ({ context, step }) => {
  return await step.run("google-form-trigger", async () => context);
};
export type Stripe_TRIGGER_DATA = Record<string, unknown>;
export const Stripetriggerexecutor: NodeExecutor<Stripe_TRIGGER_DATA> = async ({
  context,
  step,
}) => {
  return await step.run("stripe-trigger", async () => context);
};

export type GEMINI_TRIGGER_DATA = {
  variableName: string;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  imageUrl:string;
  credentialId?:string
};

export const GeminiExecutor: NodeExecutor<GEMINI_TRIGGER_DATA> = async ({
  context,
  step,
  data,
  userId
}) => {

  const { systemPrompt, userPrompt } = data;
    let apiKey;
  console.log(data.credentialId)
   if(!data.credentialId){
     throw new NonRetriableError("Missing GOOGLE_GENERATIVE_AI_API_KEY");
   }
   if (data.credentialId) {

     
       const credential= await prisma.credentials.findUnique({
         where: { id: data.credentialId ,
          userId:userId
         },
       });
     

     if (credential?.value) {
       apiKey = decrypt(credential.value);
     }
   }
   if (!apiKey) {
     throw new NonRetriableError(
       "Missing Gemini API Key. Please select a credential in the node settings."
     );
   }


  const google = createGoogleGenerativeAI({ apiKey });

  let modelName = data.model?.trim() || "gemini-1.5-flash";
  if (modelName === "gemini-pro") modelName = "gemini-1.5-pro";

  if (!userPrompt) throw new NonRetriableError("No User Prompt Provided");

  const result = await step.run("gemini-generate-text", async () => {
    const compiledUserPrompt = Handlebars.compile(userPrompt)(context);
    const compiledSystemPrompt = systemPrompt
      ? Handlebars.compile(systemPrompt)(context)
      : undefined;
    const compiledImageUrl = data.imageUrl
        ? Handlebars.compile(data.imageUrl)(context).trim()
        : undefined;

        const messages = [
          {
            role: "user",
            content: [
              { type: "text", text: compiledUserPrompt },
              ...(compiledImageUrl
                ? [{ type: "image", image: compiledImageUrl }]
                : []),
            ],
          },
        ];

    const { text } = await generateText({
      model: google(modelName) as any, 
      system: compiledSystemPrompt,
      prompt: messages as any,
    });

    return text;
  });

  const variableName = data.variableName?.trim() || "aiResponse";
  return { ...context, [variableName]: result };
};


export type Anthropic_TRIGGER_DATA = {
  variableName: string;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  credentialId?: string;
};

export const AnthropicExecutor: NodeExecutor<Anthropic_TRIGGER_DATA> = async ({
  context,
  step,
  data,
  userId
}) => {
  const { systemPrompt, userPrompt, model } = data;


     let apiKey;
     console.log(data.credentialId);
     if (!data.credentialId) {
       throw new NonRetriableError("Missing GOOGLE_GENERATIVE_AI_API_KEY");
     }
     if (data.credentialId) {
       const credential = await prisma.credentials.findUnique({
         where: { id: data.credentialId, userId: userId },
       });

       if (credential?.value) {
        apiKey = decrypt(credential.value);
       }
     }
     if (!apiKey) {
       throw new NonRetriableError(
         "Missing Gemini API Key. Please select a credential in the node settings."
       );
     }
  const anthropic = createAnthropic({ apiKey });

  if (!userPrompt) throw new NonRetriableError("No User Prompt Provided");

  const result = await step.run("claude-generate-text", async () => {
    const compiledUserPrompt = Handlebars.compile(userPrompt)(context);
    const compiledSystemPrompt = systemPrompt
      ? Handlebars.compile(systemPrompt)(context)
      : undefined;

    const { text } = await generateText({
      model: anthropic(model || "claude-3-5-sonnet-20241022") as any,
      system: compiledSystemPrompt,
      prompt: compiledUserPrompt,
    });

    return text;
  });

  const variableName = data.variableName?.trim() || "aiResponse";
  return { ...context, [variableName]: result };
};


export type OPENAI_TRIGGER_DATA = {
  variableName: string;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  credentialId:string
};

export const OPENAIExecutor: NodeExecutor<OPENAI_TRIGGER_DATA> = async ({
  context,
  step,
  data,
  userId
}) => {
  const { systemPrompt, userPrompt, model } = data;
   let apiKey;
   console.log(data.credentialId);
   if (!data.credentialId) {
     throw new NonRetriableError("Missing GOOGLE_GENERATIVE_AI_API_KEY");
   }
   if (data.credentialId) {
    const credential = await prisma.credentials.findUnique({
      where: { id: data.credentialId, userId: userId },
    });

     if (credential?.value) {
          apiKey = decrypt(credential.value);
     }
   }
   if (!apiKey) {
     throw new NonRetriableError(
       "Missing Gemini API Key. Please select a credential in the node settings."
     );
   }


  const openai = createOpenAI({ apiKey });

  if (!userPrompt) throw new NonRetriableError("No User Prompt Provided");

  const result = await step.run("openai-generate-text", async () => {
    const compiledUserPrompt = Handlebars.compile(userPrompt)(context);
    const compiledSystemPrompt = systemPrompt
      ? Handlebars.compile(systemPrompt)(context)
      : undefined;

    const { text } = await generateText({
      model: openai(model || "gpt-4o-mini") as any,
      system: compiledSystemPrompt,
      prompt: compiledUserPrompt,
    });

    return text;
  });

  const variableName = data.variableName?.trim() || "aiResponse";
  return { ...context, [variableName]: result };
};
