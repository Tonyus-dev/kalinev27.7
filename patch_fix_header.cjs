const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const regex = /                        <\/div>\n            <\/div>\n            \{\/\* Centered: Brand name \*\/\}[\s\S]*?            <\/div>\n          <\/div>\n/;
file = file.replace(regex, '');

fs.writeFileSync('src/components/KalineChat.tsx', file);
