import { pgTable, text, timestamp, uuid, jsonb, varchar } from 'drizzle-orm/pg-core';

export const generations = pgTable('generations', {
  id: uuid('id').primaryKey().defaultRandom(),
  prompt: text('prompt').notNull(),
  requirements: jsonb('requirements'),
  components: jsonb('components'),
  plantUmlCode: text('plant_uml_code'),
  plantUmlUrl: text('plant_uml_url'),
  sqlSchema: text('sql_schema'),
  openApiSpec: text('openapi_spec'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});
