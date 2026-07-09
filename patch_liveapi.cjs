const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const liveApiCode = `
  useEffect(() => {
    let ws: WebSocket | null = null;
    let audioContext: AudioContext | null = null;
    let stream: MediaStream | null = null;

    if (isListening) {
      const startLive = async () => {
        try {
          const geminiKey = localStorage.getItem('kaline_gemini_key');
          if (!geminiKey) {
            setInput(prev => prev + " [Erro: Chave Gemini não configurada]");
            setIsListening(false);
            return;
          }

          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          ws = new WebSocket('wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=' + geminiKey);
          
          ws.onopen = () => {
            ws?.send(JSON.stringify({
              setup: { model: "models/gemini-3.1-flash-live-preview" }
            }));
            
            // Ponytail way: we just send a text to start it
            ws?.send(JSON.stringify({
              clientContent: {
                turns: [{ role: "user", parts: [{ text: "Estou enviando áudio para você." }] }],
                turnComplete: true
              }
            }));
            
            // Simplified audio sending (only 1 chunk just to trigger the API test)
            const mediaRecorder = new MediaRecorder(stream!);
            mediaRecorder.ondataavailable = async (e) => {
               if (e.data.size > 0 && ws?.readyState === WebSocket.OPEN) {
                 const buffer = await e.data.arrayBuffer();
                 const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
                 ws?.send(JSON.stringify({
                    realtimeInput: { mediaChunks: [{ mimeType: e.data.type || 'audio/webm', data: base64 }] }
                 }));
               }
            };
            mediaRecorder.start(1000);
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              if (data.serverContent?.modelTurn) {
                const text = data.serverContent.modelTurn.parts.map((p: any) => p.text).join('');
                if (text) {
                  setMessages(prev => [...prev, { sender: 'kaline', text: '[Live API] ' + text, timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
                }
              }
            } catch(e) {}
          };

          ws.onerror = () => setIsListening(false);
          ws.onclose = () => setIsListening(false);

        } catch (e) {
          setIsListening(false);
        }
      };
      startLive();
    } else {
       if (ws) ws.close();
       if (stream) stream.getTracks().forEach(t => t.stop());
    }

    return () => {
      if (ws) ws.close();
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [isListening]);
`;

file = file.replace(/  useEffect\(\(\) => \{\n    if \(isListening\) \{\n      try \{\n        const SpeechRecognition[\s\S]*?  \}, \[isListening\]\);/, liveApiCode.trim());

fs.writeFileSync('src/components/KalineChat.tsx', file);
