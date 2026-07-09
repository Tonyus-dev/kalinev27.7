const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// Remove Mode Switcher Avatar
file = file.replace(
  /\s*\{\/\* Mode Switcher Avatar \*\/\}[\s\S]*?<\/button>/,
  ""
);

// Make chat avatar clickable
file = file.replace(
  /<div className=\{\`w-8 h-8 rounded-full border \$\{mt\.border\}\/40 overflow-hidden bg-gradient-to-tr \$\{mt\.avatarFrom\} \$\{mt\.avatarTo\} flex items-center justify-center shrink-0 \$\{mt\.shadow8\}\`\}>/,
  `<button 
                      onClick={() => setActiveMode(prev => prev === 'kaline' ? 'coder' : 'kaline')}
                      title="Alternar Faceta (Kaline / Klio)"
                      className={\`w-8 h-8 rounded-full border \${mt.border}/40 overflow-hidden bg-gradient-to-tr \${mt.avatarFrom} \${mt.avatarTo} flex items-center justify-center shrink-0 \${mt.shadow8} cursor-pointer hover:scale-105 active:scale-95 transition-transform\`}
                    >`
);

file = file.replace(
  /<\/span>\s*<\/div>\s*\) : \(/,
  `</span>
                    </button>
                  ) : (`
);

fs.writeFileSync('src/components/KalineChat.tsx', file);
