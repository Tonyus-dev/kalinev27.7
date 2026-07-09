const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// Remove V27/V27b toggle from chat
file = file.replace(
  /\s*\{\/\* Toggle V27\/V27b Button \*\/\}[\s\S]*?<\/button>/,
  ""
);

// Modify Sedimentation button
file = file.replace(
  /onClick=\{\(\) => \{\s*if \(showSedimentPanel && sidebarTab === 'sediments'\) \{\s*setShowSedimentPanel\(false\);\s*\} else \{\s*setShowSedimentPanel\(true\);\s*setSidebarTab\('sediments'\);\s*\}\s*\}\}/,
  "onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'sedimentos' }))}"
);

fs.writeFileSync('src/components/KalineChat.tsx', file);

let appFile = fs.readFileSync('src/App.tsx', 'utf8');

// Remove Version Indicator button
appFile = appFile.replace(
  /\s*\{\/\* Version Indicator \*\/\}[\s\S]*?<\/button>/,
  ""
);

// Remove Connection badge
appFile = appFile.replace(
  /\s*\{\/\* Connection badge \*\/\}[\s\S]*?<\/span>\s*<\/div>\s*<\/header>/,
  "\n        </div>\n      </header>"
);

// Add event listener for navigateTab in useEffect
appFile = appFile.replace(
  /const handleOffline = \(\) => setIsOnline\(false\);/,
  `const handleOffline = () => setIsOnline(false);
    const handleNavigate = (e: any) => setActiveTab(e.detail);
    window.addEventListener('navigateTab', handleNavigate);`
);

appFile = appFile.replace(
  /window\.removeEventListener\('offline', handleOffline\);/,
  `window.removeEventListener('offline', handleOffline);
      window.removeEventListener('navigateTab', handleNavigate);`
);

fs.writeFileSync('src/App.tsx', appFile);
