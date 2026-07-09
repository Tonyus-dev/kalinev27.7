const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const regex = /          \{\/\* Elegant sub-header with the active mode toggle \*\/\}\n          <div className="flex border-b border-\[#FF4C1F\]\/10 bg-\[#07080B\] p-1 gap-1 shrink-0">[\s\S]*?          <\/div>/;
file = file.replace(regex, '');

fs.writeFileSync('src/components/KalineChat.tsx', file);
