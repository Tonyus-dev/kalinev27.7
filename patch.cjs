const fs = require('fs');
let code = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');
const search = `        const geminiKey = localStorage.getItem('kaline_gemini_key');
      if (geminiKey && !lower.includes('código')) {
try {
          const ai = new GoogleGenAI({ apiKey: geminiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: [{ role: 'user', parts: [{ text: contextBlock + "\\n\\nUsuário: " + userText }] }],
            config: { 
               systemInstruction: { parts: [{ text: "Você é a Kaline. Responda de forma rápida e concisa." }] }
            }
          });
          responseText = response.text || "[Resposta vazia]";
        } catch(e) {
          responseText = "[Erro de rede com Gemini API]";
        }
      }`;
const replace = `        const geminiKey = localStorage.getItem('kaline_gemini_key');
      if (geminiKey && !lower.includes('código')) {
        try {
          const ai = new GoogleGenAI({ apiKey: geminiKey });

          let cachedTokenId = null;
          if (isPromptCachingEnabled) {
            cachedTokenId = await promptCacheManager.getValidCacheToken(
              'gemini',
              contextBlock,
              async () => {
                await new Promise(r => setTimeout(r, 600)); 
                return { id: \`cache_\${Date.now()}\` };
              }
            );
          }

          const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: [{ role: 'user', parts: [{ text: contextBlock + "\\n\\nUsuário: " + userText }] }],
            config: { 
               systemInstruction: { parts: [{ text: "Você é a Kaline. Responda de forma rápida e concisa." }] }
            }
          });
          responseText = response.text || "[Resposta vazia]";
        } catch(e) {
          responseText = "[Erro de rede com Gemini API]";
        }
      }`;

if (code.includes(search)) {
  fs.writeFileSync('src/components/KalineChat.tsx', code.replace(search, replace));
  console.log("Patched successfully");
} else {
  console.log("Search string not found!");
}
