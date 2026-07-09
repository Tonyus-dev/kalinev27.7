const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

if (!file.includes('import { GoogleGenAI }')) {
  file = "import { GoogleGenAI } from '@google/genai';\n" + file;
}

fs.writeFileSync('src/components/KalineChat.tsx', file);
