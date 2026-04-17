import { getModel } from "./model";
import { ComponentsSchema, ComponentsType, RequirementsType } from "./schemas";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

const promptTemplate = `You are a Principal Cloud Architect.
Your task is to design a high-level system architecture based on the provided software requirements.
Output the services, databases, and network connections that form the system.
Return ONLY valid JSON according to the schema.
Ensure your choices represent modern, scalable, and production-ready patterns (e.g., microservices if appropriate, standard SQL/NoSQL databases, Caching layers, Message Queues).

Requirements context will be provided as JSON.`;

export async function generateComponents(requirements: RequirementsType): Promise<ComponentsType> {
  const model = getModel();
  const structuredModel = model.withStructuredOutput(ComponentsSchema);
  
  const messages = [
    new SystemMessage(promptTemplate),
    new HumanMessage(JSON.stringify(requirements, null, 2)),
  ];

  const result = await structuredModel.invoke(messages);
  return result;
}
