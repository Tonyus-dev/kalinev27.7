const fs = require('fs');
let file = fs.readFileSync('src/components/CavernaEcoPanel.tsx', 'utf8');

// Add import
if (!file.includes('import { GoogleGenAI }')) {
  file = file.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { GoogleGenAI } from '@google/genai';");
}

const genaiCode = `
              try {
                const ai = new GoogleGenAI({ apiKey: geminiKey });
                const response = await ai.models.generateContent({
                  model: 'gemini-3.5-flash',
                  contents: [
                    { role: 'user', parts: [
                      { text: "Por favor, transcreva o seguinte áudio:" },
                      { inlineData: { mimeType: audioBlob.type || 'audio/webm', data: base64data } }
                    ]}
                  ]
                });
                transcription = response.text || "Sem transcrição.";
              } catch(e) {
                console.error(e);
                transcription = "Erro na transcrição.";
              }
`;

const fetchRegex = /              try \{\n                const res = await fetch\('https:\/\/generativelanguage\.googleapis\.com\/v1beta\/models\/gemini-3\.5-flash:generateContent\?key=' \+ geminiKey, \{[\s\S]*?                if \(data\.candidates && data\.candidates\[0\]\) \{\n                  transcription = data\.candidates\[0\]\.content\.parts\[0\]\.text;\n                \}\n              \} catch\(e\) \{\n                console\.error\(e\);\n                transcription = "Erro na transcrição\.";\n              \}/;

file = file.replace(fetchRegex, genaiCode.trim());

fs.writeFileSync('src/components/CavernaEcoPanel.tsx', file);
