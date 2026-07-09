const fs = require('fs');
let code = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const search = `      } else if (sender === 'kharis') {
        selectedVoice = voices.find(v => v.name.includes('Aoede')); // Or another voice
      } else {
        selectedVoice = voices.find(v => v.name.includes('Aoede'));
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (sender === 'coder' ? v.name.includes('Sulafat') : v.name.includes('Aoede')));
      }`;

const replace = `      } else if (sender === 'kharis') {
        selectedVoice = voices.find(v => v.name.includes('Aoede'));
      } else {
        selectedVoice = voices.find(v => v.name.includes('Vindemiatrix'));
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (sender === 'coder' ? v.name.includes('Sulafat') : sender === 'kharis' ? v.name.includes('Aoede') : v.name.includes('Vindemiatrix')));
      }`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/KalineChat.tsx', code);
console.log("Fixed");
