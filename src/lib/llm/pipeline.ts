import { GenerationResult } from "../types";
import { extractRequirements } from "./step1-requirements";
import { generateComponents } from "./step2-components";
import { generateOpenAPISpec, generatePlantUML, generateSQLSchema } from "./step3-artifacts";
import { encodePlantUML } from "../plantuml";

/**
 * Orchestrates the multi-step deterministic LLM pipeline.
 */
export async function runPipeline(prompt: string): Promise<GenerationResult> {
  console.log("Step 1: Extracting Requirements...");
  const requirements = await extractRequirements(prompt);
  
  console.log("Step 2: Generating Components...");
  const components = await generateComponents(requirements);
  
  console.log("Step 3: Generating Artifacts (Parallel)...");
  // Run sequentially to avoid Gemini 429 Rate Limit (Free Tier concurrency limits)
  const plantUmlCode = await generatePlantUML(components);
  const sqlSchema = await generateSQLSchema(components);
  const openApiSpec = await generateOpenAPISpec(components);
  
  console.log("Encoding PlantUML...");
  const plantUmlUrl = encodePlantUML(plantUmlCode);
  
  console.log("Pipeline Complete.");
  return {
    requirements,
    components,
    plantUml: plantUmlCode,
    plantUmlUrl,
    sqlSchema,
    openApiSpec
  };
}
