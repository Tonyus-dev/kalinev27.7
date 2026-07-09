const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const searchTab = `    { id: 'tailscale', label: 'Tailscale', icon: Share2, category: 'Estação' },`;
const replaceTab = `    { id: 'tailscale', label: 'Tailscale', icon: Share2, category: 'Estação' },
    { id: 'cache', label: 'Estação de Cache', icon: Database, category: 'Estação' },`;

code = code.replace(searchTab, replaceTab);
fs.writeFileSync('src/App.tsx', code);
console.log("Tabs patched");
