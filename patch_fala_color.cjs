const fs = require('fs');
let code = fs.readFileSync('src/components/ModoFalaPanel.tsx', 'utf8');

const search = `  } : activeMode === 'kharis' ? {
    primary: '#D49A26',
    primaryClass: 'text-[#D49A26]',
    primaryBgClass: 'bg-[#D49A26]',
    primaryBg10: 'bg-[#D49A26]/10',
    primaryBg20: 'bg-[#D49A26]/20',
    primaryBorder20: 'border-[#D49A26]/20',
    primaryBorder30: 'border-[#D49A26]/30',
    primaryBorder50: 'border-[#D49A26]/50',
    hoverPrimaryBg20: 'hover:bg-[#D49A26]/20',
    title: 'Kháris',
    subtitle: 'Motor de Fala Ativo'
  } : {`;

const replace = `  } : activeMode === 'kharis' ? {
    primary: '#E0A84E',
    primaryClass: 'text-[#E0A84E]',
    primaryBgClass: 'bg-[#E0A84E]',
    primaryBg10: 'bg-[#E0A84E]/10',
    primaryBg20: 'bg-[#E0A84E]/20',
    primaryBorder20: 'border-[#E0A84E]/20',
    primaryBorder30: 'border-[#E0A84E]/30',
    primaryBorder50: 'border-[#E0A84E]/50',
    hoverPrimaryBg20: 'hover:bg-[#E0A84E]/20',
    title: 'Kháris',
    subtitle: 'Motor de Fala Ativo'
  } : {`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/ModoFalaPanel.tsx', code);
console.log("Patched ModoFalaPanel");
