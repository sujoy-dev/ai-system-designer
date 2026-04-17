import { z } from "zod";

export const RequirementsSchema = z.object({
  projectName: z.string().describe("The name of the project based on the prompt"),
  description: z.string().describe("A high-level description of what the system does"),
  functionalRequirements: z.array(z.string()).describe("List of functional requirements"),
  nonFunctionalRequirements: z.array(z.string()).describe("List of non-functional requirements (e.g., performance, security)"),
  userRoles: z.array(z.object({
    name: z.string(),
    description: z.string(),
    permissions: z.array(z.string()),
  })).describe("Types of users interacting with the system"),
  dataEntities: z.array(z.object({
    name: z.string(),
    description: z.string(),
    attributes: z.array(z.string()),
  })).describe("Core data entities the system needs to manage"),
  externalIntegrations: z.array(z.string()).describe("External APIs, services, or systems the app needs to talk to"),
});

export const ComponentsSchema = z.object({
  services: z.array(z.object({
    name: z.string(),
    type: z.enum(["frontend", "backend", "database", "cache", "queue", "external"]),
    technology: z.string().describe("Recommended technology stack (e.g., Next.js, FastAPI, Postgres)"),
    description: z.string(),
    endpoints: z.array(z.string()).optional(),
  })).describe("Microservices, monoliths, or external services"),
  databases: z.array(z.object({
    name: z.string(),
    type: z.enum(["relational", "document", "key-value", "graph", "memory"]),
    tables: z.array(z.object({
      name: z.string(),
      columns: z.array(z.object({
        name: z.string(),
        type: z.string(),
        constraints: z.array(z.string()),
      })),
    })),
  })).describe("Databases and their schemas"),
  connections: z.array(z.object({
    from: z.string(),
    to: z.string(),
    protocol: z.string().describe("e.g., HTTPS, gRPC, TCP"),
    description: z.string(),
  })).describe("How the services connect to each other"),
});

export type RequirementsType = z.infer<typeof RequirementsSchema>;
export type ComponentsType = z.infer<typeof ComponentsSchema>;
