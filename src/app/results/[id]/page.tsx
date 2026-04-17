import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { generations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import DiagramViewer from "@/components/DiagramViewer";
import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";
import { StoredGeneration } from "@/lib/types";

// Server Component
export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  if (!resolvedParams.id) {
    notFound();
  }

  const results = await db
    .select()
    .from(generations)
    .where(eq(generations.id, resolvedParams.id))
    .limit(1);

  if (!results || results.length === 0) {
    notFound();
  }

  // Cast DB record to our strongly typed format
  const generation = results[0] as unknown as StoredGeneration;

  if (generation.status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200">
          <h2 className="text-xl font-bold mb-2">Generation Failed</h2>
          <p>{generation.errorMessage || "An unknown error occurred."}</p>
        </div>
        <Link href="/" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
          Try Again
        </Link>
      </div>
    );
  }

  if (generation.status === 'processing' || generation.status === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-400">Processing... Check back shortly or refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Architecture</h1>
          <p className="text-slate-400 mt-1 line-clamp-2 max-w-2xl text-sm">
            Based on: "{generation.prompt}"
          </p>
        </div>
        <Link href="/" className="text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors shadow-sm shrink-0">
          Generate New System
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Requirements & Components JSON Explorer Context */}
        <div className="col-span-1 space-y-6">
          <div className="glass-panel p-5 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-brand-500 mr-2"></span>
              Extracted Context
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="text-slate-400 font-medium mb-1">Project Name</h3>
                <p className="text-slate-200 font-medium">{generation.requirements?.projectName || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-slate-400 font-medium mb-1">Description</h3>
                <p className="text-slate-300 leading-relaxed text-xs">{generation.requirements?.description || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-slate-400 font-medium mb-1 mt-4">Core Services</h3>
                <ul className="space-y-2">
                  {generation.components?.services?.map((svc, i) => (
                    <li key={i} className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                      <span className="text-brand-400 font-medium text-xs block">{svc.name}</span>
                      <span className="text-slate-400 text-xs">{svc.technology}</span>
                    </li>
                  )) || <li className="text-slate-500">None extracted</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-1 lg:col-span-3 space-y-8">
          
          <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
            <div className="border-b border-slate-800 bg-slate-900/50 p-4">
              <h2 className="font-semibold flex items-center">
                <span className="mr-2">📊</span> Architecture Diagram
              </h2>
            </div>
            <div className="p-6 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
              <DiagramViewer url={generation.plantUmlUrl} rawCode={generation.plantUmlCode} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel rounded-2xl overflow-hidden h-[600px] flex flex-col shadow-2xl">
              <div className="border-b border-slate-800 bg-slate-900/50 p-4 shrink-0">
                <h2 className="font-semibold flex items-center">
                  <span className="mr-2">💾</span> Database Schema
                </h2>
              </div>
              <div className="flex-1 p-0 overflow-hidden bg-[#040404]">
                <CodeBlock code={generation.sqlSchema} language="sql" title="schema.sql" />
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden h-[600px] flex flex-col shadow-2xl">
              <div className="border-b border-slate-800 bg-slate-900/50 p-4 shrink-0">
                <h2 className="font-semibold flex items-center">
                  <span className="mr-2">🔌</span> OpenAPI Specification
                </h2>
              </div>
              <div className="flex-1 p-0 overflow-hidden bg-[#040404]">
                <CodeBlock code={generation.openApiSpec} language="yaml" title="openapi.yaml" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
