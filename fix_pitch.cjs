const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

file = file.replace(
  /if \(selectedVoice\) utterance\.voice = selectedVoice;/g,
  `if (selectedVoice) utterance.voice = selectedVoice;
      utterance.pitch = sender === 'coder' ? 0.9 : 1.1; // Ajuste de tom de voz (mais grave para Klio, mais agudo para Kaline)`
);

fs.writeFileSync('src/components/KalineChat.tsx', file);
