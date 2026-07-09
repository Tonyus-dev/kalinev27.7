const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const headerCode = `
          {/* Mobile Style Header faithful to screenshot */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#FF4C1F]/15 bg-[#090A0D]/90 backdrop-blur-md select-none">
            {/* Left: Burning/Glowing K Seal */}
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF4C1F] to-[#FF7A3D] p-[1px] flex items-center justify-center shadow-[0_0_10px_rgba(255,76,31,0.3)]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-[#FF4C1F] font-serif tracking-tighter">
                  K
                </div>
              </div>
            </div>
            {/* Centered: Brand name */}
            <div className="text-center">
              <span className="text-[#F7EFE7] font-serif text-sm tracking-[0.25em] font-extrabold select-none">
                K ∧ L I N E .
              </span>
            </div>
            {/* Right: Semaphore Glowing Indicator */}
            <div className="flex items-center gap-2">
              <span className={\`w-3.5 h-3.5 rounded-full transition-all duration-500 \${
                presencaRegime === 'green' ? 'bg-emerald-500 shadow-[0_0_12px_#10B981]' :
                presencaRegime === 'yellow' ? 'bg-[#FFB800] shadow-[0_0_12px_#FFB800]' :
                presencaRegime === 'blue' ? 'bg-blue-500 shadow-[0_0_12px_#3B82F6]' :
                'bg-red-500 shadow-[0_0_12px_#EF4444]'
              }\`}></span>
            </div>
          </div>
`;

file = file.replace(
  '{/* Elegant sub-header with the active mode toggle */}',
  headerCode + '\n          {/* Elegant sub-header with the active mode toggle */}'
);

fs.writeFileSync('src/components/KalineChat.tsx', file);
