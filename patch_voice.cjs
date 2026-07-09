const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const micPatch = `
  useEffect(() => {
    if (isListening) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.lang = 'pt-BR';
          recognition.interimResults = false;
          recognition.maxAlternatives = 1;

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + (prev ? ' ' : '') + transcript);
            setIsListening(false);
            
            // Optionally auto-send
            // setTimeout(() => handleSend(), 500);
          };
          
          recognition.onerror = (event: any) => {
            console.error(event.error);
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognition.start();
        } else {
          alert('Reconhecimento de voz não suportado neste navegador.');
          setIsListening(false);
        }
      } catch (e) {
        setIsListening(false);
      }
    }
  }, [isListening]);
`;

file = file.replace('  useEffect(() => {\n    if (pipelineStep === \'idle\') return;', micPatch + '\n  useEffect(() => {\n    if (pipelineStep === \'idle\') return;');

// Add speech synthesis to processMessage
file = file.replace('setPipelineStep(\'idle\');', 'setPipelineStep(\'idle\');\n      if ((window as any).speechSynthesis && responseText && !responseText.includes("[Erro")) {\n        const utterance = new SpeechSynthesisUtterance(responseText.replace(/\\[.*?\\]/g, ""));\n        utterance.lang = "pt-BR";\n        window.speechSynthesis.speak(utterance);\n      }');

fs.writeFileSync('src/components/KalineChat.tsx', file);
