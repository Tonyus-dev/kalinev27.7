const fs = require('fs');
let code = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// The replacement string to match
const search = `          let cachedTokenId = null;          if (isPromptCachingEnabled) {            cachedTokenId = await promptCacheManager.getValidCacheToken(              'gemini',              contextBlock,              async () => {                await new Promise(r => setTimeout(r, 600));                return { id: \`cache_\${Date.now()}\` };              }            );          }`;

// Let's find all occurrences
let parts = code.split(search);

if (parts.length === 4) {
    // parts[0] is before 1st, parts[1] before 2nd, parts[2] before 3rd, parts[3] after 3rd
    // We only want to keep the 3rd one. So replace the first two with empty string.
    code = parts[0] + parts[1] + parts[2] + search + parts[3];
    fs.writeFileSync('src/components/KalineChat.tsx', code);
    console.log("Fixed successfully");
} else {
    console.log("Expected 4 parts, got " + parts.length);
}
