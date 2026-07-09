const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// Add import
if (!file.includes('import { GoogleGenAI }')) {
  file = file.replace("import { useState, useEffect, useRef } from 'react';", "import { useState, useEffect, useRef } from 'react';\nimport { GoogleGenAI } from '@google/genai';");
}

const genaiChatCode = `
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
`;

const fetchChatRegex = /        try \{\n          const res = await fetch\('https:\/\/generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-3\.1-flash-lite:generateContent\?key=' \+ geminiKey, \{[\s\S]*?          \} else \{\n             responseText = "\[Erro ao conectar com Gemini API\]";\n          \}\n        \} catch\(e\) \{\n          responseText = "\[Erro de rede com Gemini API\]";\n        \}/;

file = file.replace(fetchChatRegex, genaiChatCode.trim());

fs.writeFileSync('src/components/KalineChat.tsx', file);
