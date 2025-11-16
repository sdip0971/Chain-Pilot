import prisma from "@/lib/db";
import { inngest } from "./client";
import { GoogleGenAI } from "@google/genai";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { createOpenAI } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { createAnthropic } from "@ai-sdk/anthropic";
const google = new GoogleGenAI({});
const openAI = createOpenAI({});
const antrophic = createAnthropic({});
export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute-ai" },
  async ({ event, step }) => {
    const { steps:openaisteps} = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openAI("gpt-4"),
        system: "you are a helpful assistant that helps to generate text based on user prompt",
        prompt: "what is 2+2",
        experimental_telemetry:{
          isEnabled:true,
          recordInputs:true,
          recordOutputs:true, 
        }
      }
    );
     const { steps:geministeps } = await step.ai.wrap(
       "gemini-generate-text",
       generateText,
       {
         model: "gemini-2.5-flash  ",
         system:
           "you are a helpful assistant that helps to generate text based on user prompt",
         prompt: "what is 2+2",
       }
     );
       const { steps: anthropicsteps } = await step.ai.wrap(
         "antrophic-generate-text",
         generateText,
         {
           model: antrophic("claude-sonnet-4-5"),
           system:
             "you are a helpful assistant that helps to generate text based on user prompt",
           prompt: "what is 2+2",
         }
       );

    // return the wrapped step results (or use steps as needed)
    return {openaisteps,geministeps ,anthropicsteps};
  }
);
