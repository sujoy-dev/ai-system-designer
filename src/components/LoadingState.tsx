'use client';

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 animate-fade-in">
      <div className="relative w-24 h-24">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-t-2 border-brand-500 rounded-full animate-spin"></div>
        {/* Inner rotating ring */}
        <div className="absolute inset-2 border-r-2 border-accent-teal rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        {/* Core pulse */}
        <div className="absolute inset-8 bg-brand-500 rounded-full blur-sm opacity-50 animate-pulse"></div>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-slate-100">Designing Your System</h3>
        <p className="text-sm text-slate-400">Our LLM architects are hard at work. This usually takes 10-20 seconds.</p>
      </div>

      <div className="w-full max-w-sm bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700">
        <div className="w-1/2 h-full bg-gradient-to-r from-brand-600 to-accent-teal rounded-full" style={{ animation: 'progress 2s ease-in-out infinite alternate' }}></div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
