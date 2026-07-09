const fs = require('fs');
let code = fs.readFileSync('src/components/ModoFalaPanel.tsx', 'utf8');

const settingsOverlay = `

      {/* Settings Drawer / Overlay */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-[#06070A]/80 z-[120] flex flex-col justify-end animate-in fade-in duration-300">
          <div className="bg-[#10131A] border-t border-[#252936] rounded-t-[32px] p-6 pb-10 flex flex-col gap-6 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F7EFE7] font-serif">Configurações de Voz</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-[#A89F96] hover:text-[#F7EFE7]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs text-[#A89F96] uppercase tracking-widest font-bold">Estilo da Voz</p>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setVoiceStyle('direta')}
                  className={\`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all \${
                    voiceStyle === 'direta' 
                      ? \`\${t.primaryBg10} \${t.primaryBorder50} \${t.primaryClass}\` 
                      : 'border-[#252936] bg-[#0B0D12] text-[#A89F96] hover:border-[#A89F96]/30'
                  }\`}
                >
                  <span className="text-sm font-bold">Direta</span>
                  <span className="text-[10px] opacity-70 text-center">Foco e objetividade</span>
                </button>
                
                <button
                  onClick={() => setVoiceStyle('calorosa')}
                  className={\`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all \${
                    voiceStyle === 'calorosa' 
                      ? \`\${t.primaryBg10} \${t.primaryBorder50} \${t.primaryClass}\` 
                      : 'border-[#252936] bg-[#0B0D12] text-[#A89F96] hover:border-[#A89F96]/30'
                  }\`}
                >
                  <span className="text-sm font-bold">Calorosa</span>
                  <span className="text-[10px] opacity-70 text-center">Acolhimento e calma</span>
                </button>
                
                <button
                  onClick={() => setVoiceStyle('formal')}
                  className={\`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all \${
                    voiceStyle === 'formal' 
                      ? \`\${t.primaryBg10} \${t.primaryBorder50} \${t.primaryClass}\` 
                      : 'border-[#252936] bg-[#0B0D12] text-[#A89F96] hover:border-[#A89F96]/30'
                  }\`}
                >
                  <span className="text-sm font-bold">Formal</span>
                  <span className="text-[10px] opacity-70 text-center">Seriedade e precisão</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-[#0B0D12] border border-[#252936]">
              <p className="text-xs text-[#A89F96] leading-relaxed">
                As configurações de voz usam a API local e alteram o tom e a velocidade (pitch/rate) da síntese para refletir o estilo escolhido, mantendo a voz principal da faceta atual.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

code = code.replace("    </div>\n  );\n}", settingsOverlay);
fs.writeFileSync('src/components/ModoFalaPanel.tsx', code);
console.log("Appended Settings Overlay");
