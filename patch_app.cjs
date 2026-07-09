const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import BrandingPanel")) {
  code = code.replace("import AgendaPanel from './components/AgendaPanel';", "import AgendaPanel from './components/AgendaPanel';\nimport BrandingPanel from './components/BrandingPanel';");
}

if (!code.includes("activeTab === 'branding'")) {
  code = code.replace("{activeTab === 'agenda' && <AgendaPanel />}", "{activeTab === 'agenda' && <AgendaPanel />}\n          {activeTab === 'branding' && <BrandingPanel onClose={() => setActiveTab('kaline')} />}");
}

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
