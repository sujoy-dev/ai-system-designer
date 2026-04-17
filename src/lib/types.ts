import { RequirementsType, ComponentsType } from './llm/schemas';

export interface GenerationResult {
  requirements: RequirementsType;
  components: ComponentsType;
  plantUml: string;
  plantUmlUrl: string;
  sqlSchema: string;
  openApiSpec: string;
}

export interface StoredGeneration {
  id: string;
  prompt: string;
  requirements: RequirementsType;
  components: ComponentsType;
  plantUmlCode: string;
  plantUmlUrl: string;
  sqlSchema: string;
  openApiSpec: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage: string | null;
  createdAt: Date;
  completedAt: Date | null;
}
