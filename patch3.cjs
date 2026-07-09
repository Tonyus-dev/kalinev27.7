const fs = require('fs');
let file = fs.readFileSync('src/components/GuardiaoPanel.tsx', 'utf8');

const keysCard = `
        {/* Card: API Keys (Credenciais) */}
        <div className="bg-[#0B0D12] border border-[#252936] rounded-3xl p-6 space-y-5 lg:col-span-2">
          <div className="border-b border-[#252936] pb-3">
            <h3 className="text-sm font-bold text-[#F7EFE7] font-serif flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#FF4C1F]" /> Credenciais de APIs
            </h3>
            <p className="text-[10px] text-[#A89F96] mt-1">Configure suas chaves separadas para os respectivos serviços de inferência e transcrição.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">OpenRouter API Key</label>
              <input
                type="password"
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-xl focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7] font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">Gemini API Key</label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-xl focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7] font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">Tavily API Key (Opcional)</label>
              <input
                type="password"
                value={tavilyKey}
                onChange={(e) => setTavilyKey(e.target.value)}
                placeholder="tvly-..."
                className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-xl focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7] font-medium"
              />
            </div>
          </div>
        </div>
`;

file = file.replace('{/* Card 1: User Identity Settings */}', keysCard + '\n        {/* Card 1: User Identity Settings */}');
fs.writeFileSync('src/components/GuardiaoPanel.tsx', file);
