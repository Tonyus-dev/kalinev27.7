const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

file = file.replace(
  /import CriacaoAppPanel from '.\/components\/CriacaoAppPanel';/,
  "import CriacaoAppPanel from './components/CriacaoAppPanel';\nimport HestiaStationPanel from './components/HestiaStationPanel';"
);

file = file.replace(
  /\{activeTab === 'criacao' && <CriacaoAppPanel \/>\}/,
  "{activeTab === 'criacao' && <CriacaoAppPanel />}\n          {activeTab === 'station' && <HestiaStationPanel />}"
);

fs.writeFileSync('src/App.tsx', file);
