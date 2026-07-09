const fs = require('fs');
let file = fs.readFileSync('src/components/CavernaEcoPanel.tsx', 'utf8');
file = file.replace("{ inlineData: { mimeType: 'audio/webm', data: base64data } }", "{ inlineData: { mimeType: audioBlob.type || 'audio/webm', data: base64data } }");
fs.writeFileSync('src/components/CavernaEcoPanel.tsx', file);
