const fs = require('fs');
let code = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const search = `import { promptCacheManager }
import { cacheStatsTracker } from '../lib/PromptCacheManager';`;

const replace = `import { promptCacheManager } from '../lib/PromptCacheManager';
import { cacheStatsTracker } from '../lib/CacheStatsTracker';`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/KalineChat.tsx', code);
console.log("Fixed import");
