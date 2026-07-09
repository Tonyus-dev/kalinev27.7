const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const regex = /          \{\/\* Mobile Style Header faithful to screenshot \*\/\}\n          <div className="flex items-center justify-between px-4 py-3 border-b border-\[#FF4C1F\]\/15 bg-\[#090A0D\]\/90 backdrop-blur-md select-none">[\s\S]*?          <\/div>\n/;
file = file.replace(regex, '');

fs.writeFileSync('src/components/KalineChat.tsx', file);
