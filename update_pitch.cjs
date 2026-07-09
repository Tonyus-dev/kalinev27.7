const fs = require('fs');
const kaline = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const search = `      utterance.pitch = sender === 'coder' ? 0.9 : sender === 'kharis' ? 1.0 : 1.1; // Ajuste de tom de voz`;

const replace = `      // Aplicar estilos de voz
      const voiceStyle = localStorage.getItem('kaline_voice_style') || 'direta';
      let basePitch = sender === 'coder' ? 0.9 : sender === 'kharis' ? 1.0 : 1.1;
      
      if (voiceStyle === 'formal') {
        utterance.pitch = Math.max(0.1, basePitch - 0.2);
        utterance.rate = 0.9;
      } else if (voiceStyle === 'calorosa') {
        utterance.pitch = Math.min(2.0, basePitch + 0.15);
        utterance.rate = 0.95;
      } else {
        utterance.pitch = basePitch;
        utterance.rate = 1.05;
      }`;

const modified = kaline.replace(search, replace);
fs.writeFileSync('src/components/KalineChat.tsx', modified);
console.log('KalineChat updated');
