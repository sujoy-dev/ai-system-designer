import { getModel } from "./model";
import { ComponentsType } from "./schemas";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export async function generatePlantUML(components: ComponentsType): Promise<string> {
  const model = getModel();
  const prompt = `You are an expert software architect.
Generate a valid PlantUML component diagram based on the provided JSON architecture components.
ONLY output raw PlantUML code, starting with @startuml and ending with @enduml.
Do not wrap it in markdown backticks. Do not include any explanations.

Use reasonable colors, grouped packages for boundaries, and clear relationship arrows (->, -->, ..>, etc.). Add brief labels to arrows if the connection protocol is specified.`;

  const result = await model.invoke([
    new SystemMessage(prompt),
    new HumanMessage(JSON.stringify(components, null, 2))
  ]);

  return String(result.content).trim();
}

export async function generateSQLSchema(components: ComponentsType): Promise<string> {
  const model = getModel();
  const prompt = `You are an expert Database Administrator.
Generate a raw SQL Data Definition Language (DDL) string based on the provided JSON architecture components.
Only include CREATE TABLE statements, foreign keys, and indexes. 
Focus only on the 'databases' section of the JSON. If no relational databases are defined, return a comment stating "-- No relational databases required".
ONLY output raw SQL. Do not wrap it in markdown backticks. Do not include explanations. Use PostgreSQL syntax.`;

  const result = await model.invoke([
    new SystemMessage(prompt),
    new HumanMessage(JSON.stringify(components, null, 2))
  ]);

  return String(result.content).trim();
}

export async function generateOpenAPISpec(components: ComponentsType): Promise<string> {
  const model = getModel();
  const prompt = `You are an expert API Designer.
Generate a valid OpenAPI 3.0.0 specification in YAML format based on the provided JSON architecture components.
Define realistic endpoints, HTTP methods, and basic request/response structures based on the 'services' and their described 'endpoints'.
If the services don't explicitly list endpoints, infer 2-3 standard REST RESTful endpoints (GET/POST) based on the service description.
ONLY output raw YAML. Do not wrap it in markdown backticks. Do not include explanations.`;

  const result = await model.invoke([
    new SystemMessage(prompt),
    new HumanMessage(JSON.stringify(components, null, 2))
  ]);

  return String(result.content).trim();
}
