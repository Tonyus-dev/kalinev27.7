const fs = require('fs');
let file = fs.readFileSync('src/components/CavernaEcoPanel.tsx', 'utf8');

const analyzeCode = `
  const analyzeSession = async () => {
    if (activeSession) {
      setActiveSession({ ...activeSession, status: 'analisando' });
      
      const openRouterKey = localStorage.getItem('kaline_openrouter_key');
      if (openRouterKey) {
        try {
          const textToAnalyze = activeSession.blocks.map(b => b.transcription || '').join(' ');
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + openRouterKey,
              'HTTP-Referer': 'https://kaline.app',
              'X-Title': 'Kaline'
            },
            body: JSON.stringify({
              model: 'google/gemini-pro-1.5',
              messages: [{ role: 'user', content: 'Estruture o seguinte pensamento em tópicos organizados: ' + textToAnalyze }]
            })
          });
          const data = await res.json();
          // Simplesmente guardamos a resposta num block ou na sessao
          // Para ser simples (Ponytail), so definimos
          activeSession.blocks.push({ id: 'analysis', order: 99, startTime: '0', endTime: '0', status: 'transcribed', transcription: data.choices[0].message.content });
        } catch(e) {
           console.error(e);
        }
      }

      setTimeout(() => {
        setActiveSession({ ...activeSession, status: 'analisada', isAnalyzed: true });
        setCurrentView('analysis');
      }, 1000);
    }
  };
`;

file = file.replace(/  const analyzeSession = \(\) => {[\s\S]*?  };/, analyzeCode.trim());
fs.writeFileSync('src/components/CavernaEcoPanel.tsx', file);
