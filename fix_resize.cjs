const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

file = file.replace(
  /\/\/ Auto-detect view mode based on screen width\s*const handleResize = \(\) => \{\s*if \(window\.innerWidth >= 1024\) \{\s*setDeviceMode\('desktop'\);\s*\} else \{\s*setDeviceMode\('mobile'\);\s*\}\s*\};\s*handleResize\(\);\s*window\.addEventListener\('resize', handleResize\);/g,
  ''
);

file = file.replace(
  /window\.removeEventListener\('resize', handleResize\);/g,
  ''
);

fs.writeFileSync('src/App.tsx', file);
