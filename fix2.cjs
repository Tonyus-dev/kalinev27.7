const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

file = file.replace(
  "isLit \n                        ? `${t.bg} shadow-[0_0_8px_#FF4C1F]'\n                        : `${t.bg}/15 border ${t.border}/5'",
  "isLit \n                        ? `${t.bg} ${t.shadow8}` \n                        : `${t.bg15} border ${t.border5}`"
);

fs.writeFileSync('src/components/KalineChat.tsx', file);
