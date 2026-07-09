const fs = require('fs');
let file = fs.readFileSync('src/components/CavernaEcoPanel.tsx', 'utf8');
file = file.replace("base64data = base64data.split(',')[1];", "base64data = base64data.split(',')[1] || '';");
fs.writeFileSync('src/components/CavernaEcoPanel.tsx', file);
