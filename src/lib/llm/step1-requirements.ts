import { getModel } from "./model";
import { RequirementsSchema, RequirementsType } from "./schemas";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const promptTemplate = `You are an expert software architect.
Your task is to extract structured software requirements from the user's natural language prompt.
Return ONLY valid JSON that matches the expected schema. 
Be comprehensive but concise. If something is not explicitly stated, infer reasonable industry-standard defaults for a modern application.`;

export async function extractRequirements(prompt: string): Promise<RequirementsType> {
  const model = getModel();
  
  // Use withStructuredOutput to enforce Zod schema
  const structuredModel = model.withStructuredOutput(RequirementsSchema);
  
  const messages = [
    new SystemMessage(promptTemplate),
    new HumanMessage(prompt),
  ];

  const result = await structuredModel.invoke(messages);
  return result;
}
