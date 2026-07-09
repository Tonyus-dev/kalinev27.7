const fs = require('fs');

function updateVoices(file) {
  let code = fs.readFileSync(file, 'utf8');

  // For KalineChat.tsx
  if (file.includes('KalineChat')) {
    const searchKaline = `      if (sender === 'coder') {
        selectedVoice = voices.find(v => v.name.includes('Sulafat'));
      } else if (sender === 'kharis') {
        selectedVoice = voices.find(v => v.name.includes('Aoede'));
      } else {
        selectedVoice = voices.find(v => v.name.includes('Vindemiatrix'));
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (sender === 'coder' ? v.name.includes('Sulafat') : sender === 'kharis' ? v.name.includes('Aoede') : v.name.includes('Vindemiatrix')));
      }`;
    
    const replaceKaline = `      if (sender === 'coder') {
        selectedVoice = voices.find(v => v.name.includes('Vindemiatrix'));
      } else if (sender === 'kharis') {
        selectedVoice = voices.find(v => v.name.includes('Despina'));
      } else {
        selectedVoice = voices.find(v => v.name.includes('Aoede'));
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (sender === 'coder' ? v.name.includes('Vindemiatrix') : sender === 'kharis' ? v.name.includes('Despina') : v.name.includes('Aoede')));
      }`;
    code = code.replace(searchKaline, replaceKaline);
  }

  // For ModoFalaPanel.tsx
  if (file.includes('ModoFalaPanel')) {
    const searchFala = `    if (activeMode === 'klio') {
      selectedVoice = voices.find(v => v.name.includes('Sulafat'));
    } else if (activeMode === 'kharis') {
      selectedVoice = voices.find(v => v.name.includes('Aoede'));
    } else {
      selectedVoice = voices.find(v => v.name.includes('Vindemiatrix'));
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (activeMode === 'klio' ? v.name.includes('Sulafat') : activeMode === 'kharis' ? v.name.includes('Aoede') : v.name.includes('Vindemiatrix')));
    }`;

    const replaceFala = `    if (activeMode === 'klio') {
      selectedVoice = voices.find(v => v.name.includes('Vindemiatrix'));
    } else if (activeMode === 'kharis') {
      selectedVoice = voices.find(v => v.name.includes('Despina'));
    } else {
      selectedVoice = voices.find(v => v.name.includes('Aoede'));
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (activeMode === 'klio' ? v.name.includes('Vindemiatrix') : activeMode === 'kharis' ? v.name.includes('Despina') : v.name.includes('Aoede')));
    }`;

    code = code.replace(searchFala, replaceFala);
  }

  fs.writeFileSync(file, code);
  console.log('Updated', file);
}

updateVoices('src/components/KalineChat.tsx');
updateVoices('src/components/ModoFalaPanel.tsx');

