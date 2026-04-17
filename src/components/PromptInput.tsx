'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PromptInput({ onLoading }: { onLoading: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.length < 10) {
      setError('Prompt must be at least 10 characters long.');
      return;
    }

    setError('');
    onLoading();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      // Navigate to the results page using the returned generation ID
      router.push(`/results/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      // Notice: If it fails, we should really signal the parent to stop loading
      // but for simplicity in this MVP, a page reload or state reset works.
      window.location.reload(); 
    }
  };

  const samplePrompts = [
    "Design a URL shortener service like Bitly that handles 10k requests per second",
    "Design a Netflix-like video streaming service backend",
    "Design an e-commerce checkout and payment integration system"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-slide-up">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-accent-teal to-brand-500 bg-300% animate-gradient">
          AI System Architect
        </h1>
        <p className="text-lg text-slate-400">
          Describe your system. We automatically generate the architecture diagram, SQL schema, and OpenAPI spec.
        </p>
      </div>

      <form onSubmit={handleGenerate} className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-300">
            System Requirements
          </label>
          <textarea
            id="prompt"
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
            placeholder="E.g., I need a ride-sharing app backend that connects riders with drivers, handles payments, and tracks real-time location..."
          />
          <div className="flex justify-between items-center text-xs">
            <span className={error ? "text-red-400" : "text-slate-500"}>
              {error || "Be as descriptive as possible."}
            </span>
            <span className="text-slate-500">{prompt.length} characters</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {samplePrompts.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPrompt(sample)}
              className="text-xs bg-slate-800/80 hover:bg-brand-500/20 hover:text-brand-400 border border-slate-700 hover:border-brand-500/50 text-slate-300 px-3 py-1.5 rounded-full transition-all"
            >
              {sample}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-brand-600 to-accent-teal hover:from-brand-500 hover:to-teal-400 text-white font-medium py-3 px-6 rounded-xl shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Generate System Design
        </button>
      </form>
    </div>
  );
}
