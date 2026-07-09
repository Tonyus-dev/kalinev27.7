const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

file = file.replace(
  /<Paperclip className="w-3\.5 h-3\.5" \/>\s*<\/button>/g,
  `<Paperclip className="w-3.5 h-3.5" />
              </button>
              {/* Toggle V27/V27b Button */}
              <button
                onClick={() => setKalineVersion(prev => prev === 'V27' ? 'V27b' : 'V27')}
                className={\`w-8 h-8 rounded-full border \${t.border}/30 hover:\${t.bg}/10 hover:\${t.border} flex items-center justify-center \${t.text} transition-all shrink-0 text-[9px] font-black font-serif\`}
                title={\`Versão Atual: \${kalineVersion}. Clique para alternar.\`}
              >
                {kalineVersion}
              </button>`
);

fs.writeFileSync('src/components/KalineChat.tsx', file);
