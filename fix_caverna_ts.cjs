const fs = require('fs');
let file = fs.readFileSync('src/components/CavernaEcoPanel.tsx', 'utf8');

file = file.replace("status: 'gravando'", "status: 'gravando',\n      isAnalyzed: false");

fs.writeFileSync('src/components/CavernaEcoPanel.tsx', file);
