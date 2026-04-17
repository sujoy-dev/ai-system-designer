'use client';

import { useState } from 'react';

export default function CodeBlock({ code, language, title }: { code: string, language: string, title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 flex flex-col h-full animate-fade-in shadow-xl">
      <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          </div>
          <span className="text-xs font-mono text-slate-400 ml-2">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs font-medium px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-4 overflow-auto flex-1 font-mono text-sm leading-relaxed text-slate-300">
        <pre>
          <code>{code || `// No \${language} content generated.`}</code>
        </pre>
      </div>
    </div>
  );
}
