const fs = require('fs');
let code = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const importStr = `import { cacheStatsTracker } from '../lib/CacheStatsTracker';\n`;

const hitSearch = `          setTempFiltered(\`[Semantic Caching Hit] Recuperando diretamente dos Sedimentos (banco vetorial local)\`);`;
const hitReplace = `          setTempFiltered(\`[Semantic Caching Hit] Recuperando diretamente dos Sedimentos (banco vetorial local)\`);
          cacheStatsTracker.recordHit('semantic', 0.0002);`;

// The semantic cache block handles the semantic miss essentially when matchingSediment is false, but we can just say if (isSemanticCachingEnabled) { if (match) hit else miss }
const searchMiss = `        if (matchingSediment) {`;
const replaceMiss = `        if (!matchingSediment) {
          cacheStatsTracker.recordMiss('semantic');
        }
        if (matchingSediment) {`;

code = code.replace(`import { promptCacheManager }`, `import { promptCacheManager }\nimport { cacheStatsTracker }`);
code = code.replace(hitSearch, hitReplace).replace(searchMiss, replaceMiss);
fs.writeFileSync('src/components/KalineChat.tsx', code);
console.log("Patched");
