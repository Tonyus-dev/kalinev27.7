const fs = require('fs');
let code = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const search = `          responseText = responseText || \`[Kaline V27 - Mobile via Workers & OpenRouter] Regime Verde (Fluxo Aberto). Estou ativa no seu celular via Cloudflare Workers e OpenRouter (com TTS/STT integrados). Como posso guiar sua disciplina prática e organização geral neste turno?\`;`;

const replace = `          if (!responseText) {
            let orCachedTokenId = null;
            if (isPromptCachingEnabled) {
              orCachedTokenId = await promptCacheManager.getValidCacheToken(
                'openrouter',
                contextBlock,
                async () => {
                  await new Promise(r => setTimeout(r, 400));
                  return { id: \`or_cache_\${Date.now()}\` };
                }
              );
            }
            responseText = \`[Kaline V27 - Mobile via Workers & OpenRouter] Regime Verde (Fluxo Aberto). Estou ativa no seu celular via Cloudflare Workers e OpenRouter (com TTS/STT integrados). Como posso guiar sua disciplina prática e organização geral neste turno?\`;
          }`;

if (code.includes(search)) {
    fs.writeFileSync('src/components/KalineChat.tsx', code.replace(search, replace));
    console.log("OpenRouter patch applied");
} else {
    console.log("Search string not found!");
}
