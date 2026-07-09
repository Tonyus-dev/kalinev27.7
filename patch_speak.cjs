const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

file = file.replace(
  "const handleSpeak = (text: string, idx: number) => {",
  "const handleSpeak = (text: string, idx: number, sender: string) => {"
);

file = file.replace(
  "onClick={() => handleSpeak(m.text, idx)}",
  "onClick={() => handleSpeak(m.text, idx, m.sender)}"
);

file = file.replace(
  /const ptVoice = voices\.find\(v => v\.lang\.includes\('pt-BR'\) \|\| v\.lang\.includes\('pt-'\)\);\n\s*if \(ptVoice\) utterance\.voice = ptVoice;/,
  `let selectedVoice;
      if (sender === 'coder') {
        selectedVoice = voices.find(v => v.name.includes('Sulafat'));
      } else {
        selectedVoice = voices.find(v => v.name.includes('Vindemiatrix'));
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (sender === 'coder' ? v.name.includes('Sulafat') : v.name.includes('Vindemiatrix')));
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt-'));
      }
      
      if (selectedVoice) utterance.voice = selectedVoice;`
);

fs.writeFileSync('src/components/KalineChat.tsx', file);
