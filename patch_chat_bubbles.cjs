const fs = require('fs');
let code = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const search = `              } : m.sender === 'kharis' ? {
                border: 'border-[#D49A26]', border20: 'border-[#D49A26]/20', border35: 'border-[#D49A26]/35',
                text: 'text-[#D49A26]', bg: 'bg-[#D49A26]', fill: 'fill-[#D49A26]',
                avatarFrom: 'from-[#1A1406]', avatarTo: 'to-[#2A1E08]', bubbleOther: 'bg-[#0E1015]/95', bubbleSelf: 'bg-[#181307]/95',
                tagName: 'KHÁRIS', tagAvatar: 'KH', tagImage: '/brand/kharis.png', shadow8: 'shadow-[0_0_8px_rgba(212,154,38,0.2)]'
              } : {`;

const replace = `              } : m.sender === 'kharis' ? {
                border: 'border-[#E0A84E]', border20: 'border-[#E0A84E]/20', border35: 'border-[#E0A84E]/35',
                text: 'text-[#E0A84E]', bg: 'bg-[#E0A84E]', fill: 'fill-[#E0A84E]',
                avatarFrom: 'from-[#4A2706]', avatarTo: 'to-[#2A1603]', bubbleOther: 'bg-[#0E1015]/95', bubbleSelf: 'bg-[#251303]/95',
                tagName: 'KHÁRIS', tagAvatar: 'KH', tagImage: '/brand/kharis.png', shadow8: 'shadow-[0_0_8px_rgba(224,168,78,0.2)]'
              } : {`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/KalineChat.tsx', code);
console.log("Patched KalineChat bubbles");
