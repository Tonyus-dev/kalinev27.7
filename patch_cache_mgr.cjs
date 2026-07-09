const fs = require('fs');
let code = fs.readFileSync('src/lib/PromptCacheManager.ts', 'utf8');

const importStr = `import { cacheStatsTracker } from './CacheStatsTracker';\n`;

const searchHit = `      console.log(\`[PromptCacheManager] Cache Hit (\${provider}): TTL válido.\`);`;
const replaceHit = `      console.log(\`[PromptCacheManager] Cache Hit (\${provider}): TTL válido.\`);
      cacheStatsTracker.recordHit(\`prompt_\${provider}\` as any, provider === 'gemini' ? 0.0005 : 0.001);`;

const searchMiss = `    console.log(\`[PromptCacheManager] Cache Miss (\${provider}): Renovando cache...\`);`;
const replaceMiss = `    console.log(\`[PromptCacheManager] Cache Miss (\${provider}): Renovando cache...\`);
    cacheStatsTracker.recordMiss(\`prompt_\${provider}\` as any);`;

code = importStr + code;
code = code.replace(searchHit, replaceHit).replace(searchMiss, replaceMiss);
fs.writeFileSync('src/lib/PromptCacheManager.ts', code);
console.log("Patched");
