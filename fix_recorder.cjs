const fs = require('fs');
let file = fs.readFileSync('src/components/CavernaEcoPanel.tsx', 'utf8');
file = file.replace("mediaRecorder.start(1000); // collect 1s chunks", "mediaRecorder.start(); // collect all at once");
fs.writeFileSync('src/components/CavernaEcoPanel.tsx', file);
