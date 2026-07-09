const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const importStr = `import CacheDashboardView from './components/CacheDashboardView';\n`;

const searchRender = `{activeTab === 'tailscale' && <TailscaleShareView />}`;
const replaceRender = `{activeTab === 'tailscale' && <TailscaleShareView />}\n          {activeTab === 'cache' && <CacheDashboardView />}`;

code = code.replace(`import TailscaleShareView`, `import TailscaleShareView from './components/TailscaleShareView';\nimport CacheDashboardView from './components/CacheDashboardView';\n// `); // Just doing a simple replace, let's just append the import if not there, wait, safer:

if (!code.includes('import CacheDashboardView')) {
    code = `import CacheDashboardView from './components/CacheDashboardView';\n` + code;
}
code = code.replace(searchRender, replaceRender);

fs.writeFileSync('src/App.tsx', code);
console.log("App.tsx patched");
