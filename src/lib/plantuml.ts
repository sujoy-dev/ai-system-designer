import plantumlEncoder from 'plantuml-encoder';

export function encodePlantUML(pumlData: string): string {
  // Use the environment variable if available, fallback to public server
  const serverUrl = process.env.PLANTUML_SERVER || 'https://www.plantuml.com/plantuml';
  
  // Clean up markdown code blocks if the LLM outputted them
  let cleanedData = pumlData.trim();
  if (cleanedData.startsWith('\`\`\`plantuml')) {
    cleanedData = cleanedData.substring(11);
  } else if (cleanedData.startsWith('\`\`\`')) {
    cleanedData = cleanedData.substring(3);
  }
  
  if (cleanedData.endsWith('\`\`\`')) {
    cleanedData = cleanedData.substring(0, cleanedData.length - 3);
  }
  
  cleanedData = cleanedData.trim();

  // Encode using the defalte algorithm required by PlantUML servers
  const encoded = plantumlEncoder.encode(cleanedData);
  
  return `${serverUrl}/svg/${encoded}`;
}
