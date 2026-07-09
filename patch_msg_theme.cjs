const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// I will just replace `t.` with `mt.` for bot-specific elements inside the map loop
file = file.replace(/const isSelf = m\.sender === 'user';/g, `const isSelf = m.sender === 'user';
              const mt = m.sender === 'coder' ? {
                border: 'border-[#E50914]', border20: 'border-[#E50914]/20', border35: 'border-[#E50914]/35',
                text: 'text-[#E50914]', bg: 'bg-[#E50914]',
                avatarFrom: 'from-[#1A0303]', avatarTo: 'to-[#2A0606]', bubbleOther: 'bg-[#0F0202]/95', bubbleSelf: 'bg-[#1A0303]/95',
                tagName: 'KLIO', tagImage: 'brand/klio.jpeg', shadow8: 'shadow-[0_0_8px_rgba(229,9,20,0.2)]'
              } : {
                border: 'border-[#FF4C1F]', border20: 'border-[#FF4C1F]/20', border35: 'border-[#FF4C1F]/35',
                text: 'text-[#FF4C1F]', bg: 'bg-[#FF4C1F]',
                avatarFrom: 'from-[#120306]', avatarTo: 'to-[#1A0609]', bubbleOther: 'bg-[#0E1015]/95', bubbleSelf: 'bg-[#180A06]/95',
                tagName: 'KALINE', tagImage: 'brand/kaline.jpeg', shadow8: 'shadow-[0_0_8px_rgba(255,76,31,0.2)]'
              };`);

// Replace bot avatar properties
file = file.replace(/className={`w-8 h-8 rounded-full border \${t\.border}\/40 overflow-hidden bg-gradient-to-tr \${t\.avatarFrom} \${t\.avatarTo} flex items-center justify-center shrink-0 \${t\.shadow8}`}/g, 
  "className={`w-8 h-8 rounded-full border ${mt.border}/40 overflow-hidden bg-gradient-to-tr ${mt.avatarFrom} ${mt.avatarTo} flex items-center justify-center shrink-0 ${mt.shadow8}`}");

file = file.replace(/src={t\.tagImage}/g, "src={mt.tagImage}");
file = file.replace(/alt={t\.tagName}/g, "alt={mt.tagName}");
file = file.replace(/<span className={`hidden font-serif font-bold \${t\.text} text-xs`}>K<\/span>/g, "<span className={`hidden font-serif font-bold ${mt.text} text-xs`}>K</span>");

// Header above bubble
file = file.replace(/<span className={`text-\[9px\] font-black \${t\.text} font-serif tracking-\[0\.2em\] uppercase`}>\n\s*\{isSelf \? 'KÁ' : t\.tagName\}\n\s*<\/span>/g, 
  "<span className={`text-[9px] font-black ${isSelf ? t.text : mt.text} font-serif tracking-[0.2em] uppercase`}>\n                        {isSelf ? 'KÁ' : mt.tagName}\n                      </span>");

// TTS button
file = file.replace(/className={`flex items-center gap-2 px-3 py-1 bg-\[#160B08\] border \${t\.border}\/30 rounded-full \${t\.text} hover:\${t\.bg}\/10 transition-all text-\[9px\] font-mono select-none shadow-sm`}/g, 
  "className={`flex items-center gap-2 px-3 py-1 bg-[#160B08] border ${mt.border}/30 rounded-full ${mt.text} hover:${mt.bg}/10 transition-all text-[9px] font-mono select-none shadow-sm`}");

file = file.replace(/<Pause className={`w-2\.5 h-2\.5 \${t\.text} \${t\.fill}`} \/>/g, "<Pause className={`w-2.5 h-2.5 ${mt.text} ${mt.fill}`} />");
file = file.replace(/<Play className={`w-2\.5 h-2\.5 \${t\.text} \${t\.fill}`} \/>/g, "<Play className={`w-2.5 h-2.5 ${mt.text} ${mt.fill}`} />");
file = file.replace(/bg-\[#FF4C1F\]/g, "${mt.bg}"); // wait, this might be unsafe if outside loop

// Bubble borders and bg
file = file.replace(/className={`p-3\.5 rounded-2xl text-xs leading-relaxed relative group border \${\n\s*isSelf\n\s*\? `\${t\.bubbleSelf} \${t\.border35} text-\[#F7EFE7\] rounded-tr-none`\n\s*: `\${t\.bubbleOther} \${t\.border20} text-\[#F7EFE7\] rounded-tl-none`\n\s*}`}/g, 
  "className={`p-3.5 rounded-2xl text-xs leading-relaxed relative group border ${\n                      isSelf \n                        ? `${t.bubbleSelf} ${t.border35} text-[#F7EFE7] rounded-tr-none` \n                        : `${mt.bubbleOther} ${mt.border20} text-[#F7EFE7] rounded-tl-none`\n                    }`}");

// Replace Equalizer lines bg
file = file.replace(/className={`w-\[1\.5px\] \${t\.bg} rounded-full transition-all \${/g, "className={`w-[1.5px] ${mt.bg} rounded-full transition-all ${");
file = file.replace(/<Volume2 className={`w-2\.5 h-2\.5 \${t\.text}`} \/>/g, "<Volume2 className={`w-2.5 h-2.5 ${mt.text}`} />");

fs.writeFileSync('src/components/KalineChat.tsx', file);
