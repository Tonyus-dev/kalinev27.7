const fs = require('fs');
let code = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const search = `  } : activeMode === 'kharis' ? {
    bg: 'bg-[#D49A26]', bg10: 'bg-[#D49A26]/10', bg15: 'bg-[#D49A26]/15', bg5: 'bg-[#D49A26]/5',
    border: 'border-[#D49A26]', border10: 'border-[#D49A26]/10', border15: 'border-[#D49A26]/15', border20: 'border-[#D49A26]/20', border30: 'border-[#D49A26]/30', border35: 'border-[#D49A26]/35', border40: 'border-[#D49A26]/40', border5: 'border-[#D49A26]/5',
    from: 'from-[#D49A26]', toHover: 'to-[#B8811A]',
    text: 'text-[#D49A26]', text60: 'text-[#D49A26]/60', hoverText: 'hover:text-[#D49A26]', hoverBg: 'hover:bg-[#D49A26]/10', hoverBorder: 'hover:border-[#D49A26]', hoverBgHover: 'hover:bg-[#B8811A]',
    ring30: 'focus:ring-[#D49A26]/30', focusBorder: 'focus:border-[#D49A26]',
    shadow12: 'shadow-[0_0_12px_rgba(212,154,38,0.35)]', shadow8: 'shadow-[0_0_8px_rgba(212,154,38,0.2)]', shadow16: 'shadow-[0_0_16px_rgba(212,154,38,0.5)]',
    avatarFrom: 'from-[#1A1406]', avatarTo: 'to-[#2A1E08]', bubbleSelf: 'bg-[#181307]/95', bubbleOther: 'bg-[#0E1015]/95',
    tagName: 'KHÁRIS', tagAvatar: 'KH', tagImage: '/brand/kharis.png',
    modeName: 'Kháris (Cuidado e Simplicidade)', modeIcon: <span className="text-[#D49A26] font-serif">KH</span>
  } : {`;

const replace = `  } : activeMode === 'kharis' ? {
    bg: 'bg-[#E0A84E]', bg10: 'bg-[#E0A84E]/10', bg15: 'bg-[#E0A84E]/15', bg5: 'bg-[#E0A84E]/5',
    border: 'border-[#E0A84E]', border10: 'border-[#E0A84E]/10', border15: 'border-[#E0A84E]/15', border20: 'border-[#E0A84E]/20', border30: 'border-[#E0A84E]/30', border35: 'border-[#E0A84E]/35', border40: 'border-[#E0A84E]/40', border5: 'border-[#E0A84E]/5',
    from: 'from-[#E0A84E]', toHover: 'to-[#C49242]',
    text: 'text-[#E0A84E]', text60: 'text-[#E0A84E]/60', hoverText: 'hover:text-[#E0A84E]', hoverBg: 'hover:bg-[#E0A84E]/10', hoverBorder: 'hover:border-[#E0A84E]', hoverBgHover: 'hover:bg-[#C49242]',
    ring30: 'focus:ring-[#E0A84E]/30', focusBorder: 'focus:border-[#E0A84E]',
    shadow12: 'shadow-[0_0_12px_rgba(224,168,78,0.35)]', shadow8: 'shadow-[0_0_8px_rgba(224,168,78,0.2)]', shadow16: 'shadow-[0_0_16px_rgba(224,168,78,0.5)]',
    avatarFrom: 'from-[#4A2706]', avatarTo: 'to-[#2A1603]', bubbleSelf: 'bg-[#251303]/95', bubbleOther: 'bg-[#0E1015]/95',
    tagName: 'KHÁRIS', tagAvatar: 'KH', tagImage: '/brand/kharis.png',
    modeName: 'Kháris (Cuidado e Simplicidade)', modeIcon: <span className="text-[#E0A84E] font-serif">KH</span>
  } : {`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/KalineChat.tsx', code);
console.log("Patched KalineChat");
