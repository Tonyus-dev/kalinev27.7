const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const apiCallCode = `
      const geminiKey = localStorage.getItem('kaline_gemini_key');
      if (geminiKey && !lower.includes('código')) {
        try {
          const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=' + geminiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: contextBlock + "\\n\\nUsuário: " + userText }] }],
              systemInstruction: { parts: [{ text: "Você é a Kaline. Responda de forma rápida e concisa." }]}
            })
          });
          if (res.ok) {
            const data = await res.json();
            responseText = data.candidates[0].content.parts[0].text;
          } else {
             responseText = "[Erro ao conectar com Gemini API]";
          }
        } catch(e) {
          responseText = "[Erro de rede com Gemini API]";
        }
      }
`;

file = file.replace('// Green\n          responseText = `[Kaline V27 - Mobile via Workers & OpenRouter]', apiCallCode + '\n          responseText = responseText || `[Kaline V27 - Mobile via Workers & OpenRouter]');
fs.writeFileSync('src/components/KalineChat.tsx', file);
