const fs = require('fs');

let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const replacements = {
  'bg-[#FF4C1F]': '${t.bg}',
  'bg-[#FF4C1F]/10': '${t.bg10}',
  'bg-[#FF4C1F]/15': '${t.bg15}',
  'bg-[#FF4C1F]/5': '${t.bg5}',
  'border-[#FF4C1F]': '${t.border}',
  'border-[#FF4C1F]/10': '${t.border10}',
  'border-[#FF4C1F]/15': '${t.border15}',
  'border-[#FF4C1F]/20': '${t.border20}',
  'border-[#FF4C1F]/30': '${t.border30}',
  'border-[#FF4C1F]/35': '${t.border35}',
  'border-[#FF4C1F]/40': '${t.border40}',
  'border-[#FF4C1F]/5': '${t.border5}',
  'fill-[#FF4C1F]': '${t.fill}',
  'from-[#FF4C1F]': '${t.from}',
  'to-[#FF7A3D]': '${t.toHover}',
  'text-[#FF4C1F]': '${t.text}',
  'text-[#FF4C1F]/60': '${t.text60}',
  'hover:text-[#FF4C1F]': '${t.hoverText}',
  'hover:bg-[#FF4C1F]/10': '${t.hoverBg}',
  'hover:border-[#FF4C1F]': '${t.hoverBorder}',
  'hover:bg-[#FF7A3D]': '${t.hoverBgHover}',
  'focus:ring-[#FF4C1F]/30': '${t.ring30}',
  'focus:border-[#FF4C1F]': '${t.focusBorder}',
  'shadow-[0_0_12px_rgba(255,76,31,0.35)]': '${t.shadow12}',
  'shadow-[0_0_8px_rgba(255,76,31,0.2)]': '${t.shadow8}',
  'shadow-[0_0_16px_rgba(239,68,68,0.5)]': '${t.shadow16}',
  'from-[#120306]': '${t.avatarFrom}',
  'to-[#1A0609]': '${t.avatarTo}',
  'bg-[#180A06]/95': '${t.bubbleSelf}',
  'bg-[#0E1015]/95': '${t.bubbleOther}',
};

// First, find all className="... #FF4C1F ..." and convert to className={`...`} 
// We will just do a general regex for className="..." that contains #FF4C1F or other keys
const regex = /className="([^"]*?(?:#FF4C1F|#FF7A3D|#120306|#1A0609|#180A06\/95|#0E1015\/95)[^"]*?)"/g;
file = file.replace(regex, (match, p1) => {
  return `className={\`${p1}\`}`;
});

// Now replace within `...` strings
for (const [key, value] of Object.entries(replacements)) {
  // Be careful not to replace parts of other strings if they overlap
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const keyRegex = new RegExp(escapeRegExp(key), 'g');
  file = file.replace(keyRegex, value);
}

// Add the `t` object right after `const [activeMode...`
const tObject = `
  const t = activeMode === 'kaline' ? {
    bg: 'bg-[#FF4C1F]', bg10: 'bg-[#FF4C1F]/10', bg15: 'bg-[#FF4C1F]/15', bg5: 'bg-[#FF4C1F]/5',
    border: 'border-[#FF4C1F]', border10: 'border-[#FF4C1F]/10', border15: 'border-[#FF4C1F]/15', border20: 'border-[#FF4C1F]/20', border30: 'border-[#FF4C1F]/30', border35: 'border-[#FF4C1F]/35', border40: 'border-[#FF4C1F]/40', border5: 'border-[#FF4C1F]/5',
    fill: 'fill-[#FF4C1F]', from: 'from-[#FF4C1F]', toHover: 'to-[#FF7A3D]',
    text: 'text-[#FF4C1F]', text60: 'text-[#FF4C1F]/60', hoverText: 'hover:text-[#FF4C1F]', hoverBg: 'hover:bg-[#FF4C1F]/10', hoverBorder: 'hover:border-[#FF4C1F]', hoverBgHover: 'hover:bg-[#FF7A3D]',
    ring30: 'focus:ring-[#FF4C1F]/30', focusBorder: 'focus:border-[#FF4C1F]',
    shadow12: 'shadow-[0_0_12px_rgba(255,76,31,0.35)]', shadow8: 'shadow-[0_0_8px_rgba(255,76,31,0.2)]', shadow16: 'shadow-[0_0_16px_rgba(239,68,68,0.5)]',
    avatarFrom: 'from-[#120306]', avatarTo: 'to-[#1A0609]', bubbleSelf: 'bg-[#180A06]/95', bubbleOther: 'bg-[#0E1015]/95',
    tagName: 'KALINE', tagAvatar: 'K', tagImage: 'brand/kaline.jpeg',
    modeName: 'Kaline (Conversa)', modeIcon: <span className="text-[#FF4C1F]">K</span>
  } : {
    bg: 'bg-[#E50914]', bg10: 'bg-[#E50914]/10', bg15: 'bg-[#E50914]/15', bg5: 'bg-[#E50914]/5',
    border: 'border-[#E50914]', border10: 'border-[#E50914]/10', border15: 'border-[#E50914]/15', border20: 'border-[#E50914]/20', border30: 'border-[#E50914]/30', border35: 'border-[#E50914]/35', border40: 'border-[#E50914]/40', border5: 'border-[#E50914]/5',
    fill: 'fill-[#E50914]', from: 'from-[#E50914]', toHover: 'to-[#ff4d4d]',
    text: 'text-[#E50914]', text60: 'text-[#E50914]/60', hoverText: 'hover:text-[#E50914]', hoverBg: 'hover:bg-[#E50914]/10', hoverBorder: 'hover:border-[#E50914]', hoverBgHover: 'hover:bg-[#ff4d4d]',
    ring30: 'focus:ring-[#E50914]/30', focusBorder: 'focus:border-[#E50914]',
    shadow12: 'shadow-[0_0_12px_rgba(229,9,20,0.35)]', shadow8: 'shadow-[0_0_8px_rgba(229,9,20,0.2)]', shadow16: 'shadow-[0_0_16px_rgba(229,9,20,0.5)]',
    avatarFrom: 'from-[#1A0303]', avatarTo: 'to-[#2A0606]', bubbleSelf: 'bg-[#1A0303]/95', bubbleOther: 'bg-[#0F0202]/95',
    tagName: 'KLIO', tagAvatar: 'K', tagImage: 'brand/klio.jpeg',
    modeName: 'Klio (Programação)', modeIcon: <span className="text-[#E50914] font-serif">K</span>
  };
`;

file = file.replace(/const \[activeMode, setActiveMode\] = useState<'kaline' \| 'coder'>\('kaline'\);/, 
  "const [activeMode, setActiveMode] = useState<'kaline' | 'coder'>('kaline');\n" + tObject);

// Replace Kaline/Ká tags manually
file = file.replace(/{isSelf \? 'KÁ' : 'KALINE'}/g, "{isSelf ? 'KÁ' : t.tagName}");
file = file.replace(/alt="Kaline"/g, 'alt={t.tagName}');
file = file.replace(/src="brand\/kaline\.jpeg"/g, 'src={t.tagImage}');

// Replace K avatar icon
file = file.replace(/<span className="hidden font-serif font-bold \${t\.text} text-xs">K<\/span>/g, '<span className="hidden font-serif font-bold ${t.text} text-xs">{t.tagAvatar}</span>');

// mode switcher
file = file.replace(/{activeMode === 'kaline' \? 'Kaline \(Conversa\)' : 'Coder \(Programação\)'}/g, '{t.modeName}');
file = file.replace(/{activeMode === 'kaline' \? <span className="\${t.text}">K<\/span> : <span className="text-emerald-400 font-mono text-\[10px\]">&lt;\/&gt;<\/span>}/g, '{t.modeIcon}');
file = file.replace(/bg-gradient-to-tr from-emerald-500 to-teal-400/g, '${t.from} ${t.toHover}');

fs.writeFileSync('src/components/KalineChat.tsx', file);
console.log("Replaced successfully!");
