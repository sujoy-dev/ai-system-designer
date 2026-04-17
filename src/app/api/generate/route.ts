import { NextResponse } from "next/server";
import { z } from "zod";
import { runPipeline } from "@/lib/llm/pipeline";
import { db } from "@/lib/db";
import { generations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const RequestSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long."),
});

export async function POST(req: Request) {
  try {
    // 1. Validate Input
    const body = await req.json();
    const result = RequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.format() },
        { status: 400 }
      );
    }

    const { prompt } = result.data;

    // 2. Create initial DB record (pending state)
    // Note: Drizzle with Neon HTTP driver usually returns arrays.
    const [record] = await db.insert(generations).values({
      prompt,
      status: "processing"
    }).returning({ id: generations.id });

    // 3. Run LLM Pipeline
    try {
      const pipelineResult = await runPipeline(prompt);
      
      // 4. Update DB record with success
      await db.update(generations).set({
        requirements: pipelineResult.requirements,
        components: pipelineResult.components,
        plantUmlCode: pipelineResult.plantUml,
        plantUmlUrl: pipelineResult.plantUmlUrl,
        sqlSchema: pipelineResult.sqlSchema,
        openApiSpec: pipelineResult.openApiSpec,
        status: "completed",
        completedAt: new Date()
      }).where(eq(generations.id, record.id));

      // 5. Return success to client
      return NextResponse.json({
        id: record.id,
        status: "completed",
        ...pipelineResult
      });

    } catch (pipelineError: any) {
      // Handle AI/Pipeline errors
      console.error("Pipeline failed:", pipelineError);
      
      await db.update(generations).set({
        status: "failed",
        errorMessage: pipelineError.message || "Unknown error occurred during generation",
        completedAt: new Date()
      }).where(eq(generations.id, record.id));

      return NextResponse.json(
        { error: "Generation failed", details: pipelineError.message },
        { status: 500 }
      );
    }

  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
