const fs = require('fs');
let file = fs.readFileSync('src/components/CavernaEcoPanel.tsx', 'utf8');

// remove the duplicated stopAudioSession
const parts = file.split('  const stopAudioSession = () => {');
if (parts.length > 2) {
  // parts[0] is everything before first stopAudioSession
  // parts[1] is the new one
  // parts[2] is the old one
  
  let rest = parts[2];
  let endOfOldStop = rest.indexOf('};') + 2;
  
  file = parts[0] + '  const stopAudioSession = () => {' + parts[1] + rest.substring(endOfOldStop);
}
fs.writeFileSync('src/components/CavernaEcoPanel.tsx', file);
