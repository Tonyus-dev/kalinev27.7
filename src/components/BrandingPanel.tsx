import React from 'react';
import { X, Sparkles } from 'lucide-react';

export default function BrandingPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#0E1015] rounded-3xl border border-[#FF4C1F]/20 shadow-[0_0_40px_rgba(255,76,31,0.1)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between p-4 px-6 border-b border-[#FF4C1F]/10 bg-gradient-to-r from-[#120306] to-[#0E1015]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4C1F] to-[#E50914] p-[1px] shadow-[0_0_12px_rgba(255,76,31,0.3)]">
            <div className="w-full h-full rounded-full bg-[#120306] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FF4C1F]" />
            </div>
          </div>
          <div>
            <h2 className="text-[#F7EFE7] font-bold tracking-wide text-sm flex items-center gap-2">
              BRANDING K∧LINE
            </h2>
            <p className="text-[#A89F96] text-[10px] uppercase tracking-widest mt-0.5">
              Identidade Visual
            </p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[#A89F96] hover:text-[#FF4C1F] hover:bg-[#FF4C1F]/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Iframe content */}
      <div className="grow relative">
        <iframe 
          src="/branding.html" 
          title="Kaline Branding"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
}
