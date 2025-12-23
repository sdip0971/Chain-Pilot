import { NonRetriableError, openaiResponses } from "inngest";

import { generateText } from "ai";

import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";

import type { NodeExecutor } from "./execution-registry";
import ky, { Options as KyOptions } from "ky";
import Handlebars from "handlebars";
import { createGoogleGenerativeAI} from "@ai-sdk/google";
import { httpRequestChannel } from "@/inngest/channels/workflowChannel";
import { isEnabled } from "@sentry/nextjs";
export type MANUAL_TRIGGER_DATA = Record<string, unknown>;
export const manualtriggerexecutor: NodeExecutor<MANUAL_TRIGGER_DATA> = async ({
  nodeId,
  context,
  step,
}) => {
  // publish loading state for manual trigger
  const result = await step.run("manual-trigger", async () => context);
  // publish success state for manualTrigger
  return result;
};
Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safestring = new Handlebars.SafeString(jsonString);
  return safestring;
});
export type HTTP_TRIGGER_DATA = {
  variableName: string;
  endpoint: string;
  body?: string;
  method: "GET" | "PUT" | "POST" | "DELETE";
};

export const httprequestexecutor: NodeExecutor<HTTP_TRIGGER_DATA> = async ({
  nodeId,
  context,
  step,
  data,
}) => {
  // publish loading state for http request
  console.log("data", data);
  if (!data.endpoint) {
    throw new NonRetriableError("Endpoint is missing");
  }

  if (!data.method) {
    throw new NonRetriableError("Method not configured");
  }

  const result = await step.run("http-request", async () => {
    const method = data.method || "GET";
    const endpoint = Handlebars.compile(data.endpoint)(context);
    // Handle bar is going to read this data.ednpoint which looks like https://...//{{todo.httpResponse.data.userId}}
    // and populate {todo.httpResponse.data.userId} from the context in which we have all previous data and compile {{todo.httpResponse.data.userId} to whatever the user id is
    if (!data.endpoint) {
      throw new NonRetriableError("No Enpoint Configured ");
    }
    if (!data.method) {
      throw new NonRetriableError("No method Configured ");
    }

    const options: KyOptions = { method };
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context); //json parse will fail if we dont pass anything so an empty object
      JSON.parse(resolved);
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }
    const response = await ky(endpoint, options);

    const responseData = await response.json().catch(() => response.text());
    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return responsePayload;
  });
  const variableName =
    data.variableName && data.variableName.trim() !== ""
      ? data.variableName
      : "httpRequest";

  return {
    ...context,
    [variableName]: result,
  };
};

export type GoogleForm_TRIGGER_DATA = Record<string, unknown>;

export const GoogleFormtriggerexecutor: NodeExecutor<
  MANUAL_TRIGGER_DATA
> = async ({ nodeId, context, step }) => {
  const result = await step.run("google-form-trigger", async () => context);

  return result;
};
export type Stripe_TRIGGER_DATA = Record<string, unknown>;

export const Stripetriggerexecutor: NodeExecutor<MANUAL_TRIGGER_DATA> = async ({
  nodeId,
  context,
  step,
}) => {
  const result = await step.run("stripe-trigger", async () => context);

  return result;
};

export type GEMINI_TRIGGER_DATA = {
  variableName: string;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
};

export const GeminiExecutor: NodeExecutor<GEMINI_TRIGGER_DATA> = async ({
  nodeId,
  context,
  step,
  data,
}) => {
  const systemPrompt = data.systemPrompt;
  const userPrompt = data.userPrompt;
  if (!userPrompt) {
    throw new NonRetriableError("No User Prompt Provided");
  }
  const model = data.model;
  if (!model) {
    throw new NonRetriableError("No Model Configured");
  }
  const credentialValue = "AIzaSyC4CSo3UbWycSjS9kA-04y1iU8dYyiRezI";
 
  const result = await step.run("gemini-request", async () => {
     try {

         const compiledUserPrompt = Handlebars.compile(userPrompt)(context);
         const compiledSystemPrompt = systemPrompt
           ? Handlebars.compile(systemPrompt)(context)
           : undefined;

         const { text } = await generateText({
           model: google(model || "gemini-1.5-flash") as any,
           system: compiledSystemPrompt,
           prompt: compiledUserPrompt,
         });

         return text;
       
     } catch(error) {
        throw new Error(`AI response failed ${error}`)
     }
  });
  const variableName =
    data.variableName && data.variableName.trim() !== ""
      ? data.variableName
      : "aiResponse";

  return {
    ...context,
    [variableName]: result,
  };
};

export type Anthropic_TRIGGER_DATA = {
  variableName: string;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
};

export const AnthropicExecutor: NodeExecutor<Anthropic_TRIGGER_DATA> = async ({
  nodeId,
  context,
  step,
  data,
}) => {
  const systemPrompt = data.systemPrompt;
  const userPrompt = data.userPrompt;
  if (!userPrompt) {
    throw new NonRetriableError("No User Prompt Provided");
  }
  const model = data.model;
  if (!model) {
    throw new NonRetriableError("No Model Configured");
  }
  const credentialValue = process.env.ANTHROPIC_API_KEY;

  const result = await step.run("gemini-request", async () => {
    try {
     
  const { text } = await generateText({
    model: anthropic("claude-3-5-sonnet-20241022") as any,
    system: systemPrompt,
    prompt: userPrompt,
  });

  return text;


    } catch {
      throw new Error("AI response failed");
    }
  });
  const variableName =
    data.variableName && data.variableName.trim() !== ""
      ? data.variableName
      : "aiResponse";

  return {
    ...context,
    [variableName]: result,
  };
};

export type OPENAI_TRIGGER_DATA = {
  variableName: string;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
};

export const OPENAIExecutor: NodeExecutor<OPENAI_TRIGGER_DATA> = async ({
  nodeId,
  context,
  step,
  data,
}) => {
  const systemPrompt = data.systemPrompt;
  const userPrompt = data.userPrompt;
  if (!userPrompt) {
    throw new NonRetriableError("No User Prompt Provided");
  }
  const model = data.model;
  if (!model) {
    throw new NonRetriableError("No Model Configured");
  }
  const credentialValue = process.env.OPENAI_API_KEY;

  const result = await step.run("openai-request", async () => {
    try {
      const result = await step.run("openai-generate-text", async () => {
        const { text } = await generateText({
        
          model: openaiResponses(data.model || "gpt-4o-mini" as any) as any,
          system: systemPrompt,
          prompt: userPrompt,
        });

        return text;
      });
    } catch {
      throw new Error("AI response failed");
    }
  });
  const variableName =
    data.variableName && data.variableName.trim() !== ""
      ? data.variableName
      : "aiResponse";

  return {
    ...context,
    [variableName]: result,
  };
};

