const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

file = file.replace(
  "className={`w-11 h-11 rounded-full p-[1px] flex items-center justify-center shrink-0 transition-all ${activeMode === 'kaline' ? 'bg-gradient-to-tr from-[#FF4C1F] to-[#FF7A3D]' : 'bg-gradient-to-tr from-emerald-500 to-teal-400'}`}",
  "className={`w-8 h-8 rounded-full p-[1px] flex items-center justify-center shrink-0 transition-all ${activeMode === 'kaline' ? 'bg-gradient-to-tr from-[#FF4C1F] to-[#FF7A3D]' : 'bg-gradient-to-tr from-emerald-500 to-teal-400'}`}"
);

file = file.replace(
  '<div className="w-full h-full rounded-full bg-[#090A0D] flex items-center justify-center font-bold text-lg font-serif tracking-tighter">',
  '<div className="w-full h-full rounded-full bg-[#090A0D] flex items-center justify-center font-bold text-base font-serif tracking-tighter">'
);

file = file.replace(
  'className="w-11 h-11 rounded-full border border-[#FF4C1F]/30 hover:bg-[#FF4C1F]/10 hover:border-[#FF4C1F] flex items-center justify-center text-[#FF4C1F] transition-all shrink-0"',
  'className="w-8 h-8 rounded-full border border-[#FF4C1F]/30 hover:bg-[#FF4C1F]/10 hover:border-[#FF4C1F] flex items-center justify-center text-[#FF4C1F] transition-all shrink-0"'
);

file = file.replace(
  '<Paperclip className="w-4.5 h-4.5" />',
  '<Paperclip className="w-3.5 h-3.5" />'
);

file = file.replace(
  'className={`w-11 h-11 rounded-full bg-[#FF4C1F] hover:bg-[#FF7A3D] text-[#06070A] transition-all flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,76,31,0.35)] ${',
  'className={`w-8 h-8 rounded-full bg-[#FF4C1F] hover:bg-[#FF7A3D] text-[#06070A] transition-all flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,76,31,0.35)] ${'
);

file = file.replace(
  '<Send className="w-4 h-4" />',
  '<Send className="w-3.5 h-3.5" />'
);

file = file.replace(
  '<MicOff className="w-4 h-4 text-white" />',
  '<MicOff className="w-3.5 h-3.5 text-white" />'
);

file = file.replace(
  '<Mic className="w-4 h-4" />',
  '<Mic className="w-3.5 h-3.5" />'
);

// We should also replace the text size of '<span className="text-emerald-400 font-mono text-xs">&lt;/&gt;</span>'
// maybe text-[10px]?
file = file.replace(
  '<span className="text-emerald-400 font-mono text-xs">&lt;/&gt;</span>',
  '<span className="text-emerald-400 font-mono text-[10px]">&lt;/&gt;</span>'
);


fs.writeFileSync('src/components/KalineChat.tsx', file);
