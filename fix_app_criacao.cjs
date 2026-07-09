const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
file = file.replace(
  /import \{ CavernaEcoPanel \} from '.\/components\/CavernaEcoPanel';/,
  "import { CavernaEcoPanel } from './components/CavernaEcoPanel';\nimport CriacaoAppPanel from './components/CriacaoAppPanel';"
);

// Add to TabType
file = file.replace(
  /type TabType = 'today' \| 'stats' \| 'monitor' \| 'tailscale' \| 'kaline' \| 'caverna' \| 'github' \| 'pritaneu' \| 'station' \| 'forge' \| 'revisao' \| 'jardim' \| 'sedimentos' \| 'identidade' \| 'guardiao';/,
  "type TabType = 'today' | 'stats' | 'monitor' | 'tailscale' | 'kaline' | 'caverna' | 'github' | 'pritaneu' | 'station' | 'forge' | 'revisao' | 'jardim' | 'sedimentos' | 'identidade' | 'guardiao' | 'criacao';"
);

// Add to tabs array
file = file.replace(
  /\{ id: 'forge', label: 'Hefaístia Forge', icon: Zap, category: 'Forja' \},/,
  "{ id: 'forge', label: 'Hefaístia Forge', icon: Zap, category: 'Forja' },\n    { id: 'criacao', label: 'Criador de App', icon: Code, category: 'Forja' },"
);

// Add component render
file = file.replace(
  /\{activeTab === 'forge' && <ForgePanel \/>\}/,
  "{activeTab === 'forge' && <ForgePanel />}\n          {activeTab === 'criacao' && <CriacaoAppPanel />}"
);

fs.writeFileSync('src/App.tsx', file);
