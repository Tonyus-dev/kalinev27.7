const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// Replace the useEffect and toggleListen
const regex = /  \/\/ Setup Speech Recognition \(STT\)[\s\S]*?        setIsListening\(false\);\n      \}\n    \}\n  \};/m;

const newCode = `
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleListen = async () => {
    if (isListening) {
      setIsListening(false);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
    } else {
      setIsListening(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
             let base64data = reader.result as string;
             base64data = base64data.split(',')[1] || '';
             
             try {
                const geminiKey = localStorage.getItem('kaline_gemini_key');
                if (!geminiKey) {
                   setInput(prev => prev + " [Erro: Chave Gemini não configurada para STT]");
                   return;
                }
                const ai = new GoogleGenAI({ apiKey: geminiKey });
                const response = await ai.models.generateContent({
                   model: 'gemini-2.5-flash',
                   contents: [
                      { role: 'user', parts: [
                          { text: "Transcreva o seguinte áudio. Escreva apenas a transcrição, sem aspas e sem explicações." },
                          { inlineData: { mimeType: audioBlob.type || 'audio/webm', data: base64data } }
                      ]}
                   ]
                });
                const transcription = response.text;
                if (transcription) {
                   setInput(prev => prev + (prev ? ' ' : '') + transcription.trim());
                }
             } catch (e) {
                console.error("STT via Gemini falhou:", e);
                setInput(prev => prev + " [Erro STT: falha na transcrição]");
             }
          };
        };
        
        mediaRecorder.start();
      } catch (err) {
        console.error('Falha ao iniciar microfone', err);
        setIsListening(false);
      }
    }
  };
`;

file = file.replace(regex, newCode.trim());

fs.writeFileSync('src/components/KalineChat.tsx', file);
