'use client';

import { useState } from 'react';

export default function DiagramViewer({ url, rawCode }: { url: string, rawCode: string }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // We load the PlantUML image. Since the background might be transparent or white,
  // we add a wrapper with a slight white background for visibility in dark mode, 
  // or invert it depending on design preference. Here we use a safe light background for the diagram itself.
  
  return (
    <div className={`flex flex-col space-y-4 \${isFullscreen ? 'fixed inset-4 z-50 glass-panel rounded-xl p-6' : ''}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Architecture Diagram</h3>
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="text-sm px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
      
      <div className={`bg-slate-50 rounded-xl overflow-auto border border-slate-700 flex justify-center items-start \${isFullscreen ? 'flex-1 p-8' : 'p-4 max-h-[600px]'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={url} 
          alt="System Architecture Diagram" 
          className="max-w-none transition-transform hover:scale-[1.02] duration-300"
        />
      </div>
      
      <details className="group">
        <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-200 transition-colors list-none flex items-center">
          <span className="mr-2 group-open:rotate-90 transition-transform">▸</span>
          View Raw PlantUML Code
        </summary>
        <pre className="mt-4 p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 overflow-x-auto">
          <code>{rawCode}</code>
        </pre>
      </details>
    </div>
  );
}
