const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// Insert fileInputRef
file = file.replace(
  "const chatEndRef = useRef<HTMLDivElement>(null);",
  "const chatEndRef = useRef<HTMLDivElement>(null);\n  const fileInputRef = useRef<HTMLInputElement>(null);"
);

const handleFileUploadCode = `
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Quick base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      let base64 = reader.result as string;
      base64 = base64.split(',')[1];
      
      const isPdf = file.type === 'application/pdf';
      const prompt = isPdf ? "Por favor, extraia e resuma o texto deste PDF." : "Por favor, descreva ou transcreva esta imagem detalhadamente.";
      
      const fileMsg: Message = {
        sender: 'user',
        text: \`[Arquivo Anexado: \${file.name}]\`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      if (activeMode === 'kaline') {
         setMessages(prev => [...prev, fileMsg]);
      } else {
         setCoderMessages(prev => [...prev, fileMsg]);
      }
      setLoading(true);

      try {
        const geminiKey = localStorage.getItem('kaline_gemini_key');
        if (!geminiKey) {
           throw new Error("Chave Gemini não configurada");
        }
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: [
            {
               role: 'user',
               parts: [
                 { text: prompt },
                 { inlineData: { mimeType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'), data: base64 } }
               ]
            }
          ]
        });
        
        const text = response.text || "Análise concluída, sem resposta visual.";
        const reply: Message = {
           sender: activeMode,
           text: text,
           timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        
        if (activeMode === 'kaline') {
           setMessages(prev => [...prev, reply]);
        } else {
           setCoderMessages(prev => [...prev, reply]);
        }
      } catch (err: any) {
         console.error(err);
         const errMsg: Message = {
           sender: activeMode,
           text: "[Erro ao processar arquivo: " + err.message + "]",
           timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
         };
         if (activeMode === 'kaline') {
            setMessages(prev => [...prev, errMsg]);
         } else {
            setCoderMessages(prev => [...prev, errMsg]);
         }
      } finally {
         setLoading(false);
         if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
  };
`;

file = file.replace(
  "// Load active contexts",
  handleFileUploadCode + "\n  // Load active contexts"
);

// Replace Input tray
const inputTrayRegex = /\{\/\* Input tray with STT Microphone integrated \*\/\}[\s\S]*?\{\/\* Middle Message Input fully rounded with branching git icon \*\/\}/;

const newInputTray = `
            {/* Input tray with STT Microphone integrated */}
            <div className="p-3 border-t border-[#FF4C1F]/10 bg-[#090A0D] flex gap-2 sm:gap-3 items-center">
              
              {/* Mode Switcher Avatar */}
              <button 
                 onClick={() => setActiveMode(prev => prev === 'kaline' ? 'coder' : 'kaline')}
                 className={\`w-11 h-11 rounded-full p-[1px] flex items-center justify-center shrink-0 transition-all \${activeMode === 'kaline' ? 'bg-gradient-to-tr from-[#FF4C1F] to-[#FF7A3D]' : 'bg-gradient-to-tr from-emerald-500 to-teal-400'}\`}
                 title={\`Modo Atual: \${activeMode === 'kaline' ? 'Kaline (Conversa)' : 'Coder (Programação)'}. Clique para alternar.\`}
              >
                 <div className="w-full h-full rounded-full bg-[#090A0D] flex items-center justify-center font-bold text-lg font-serif tracking-tighter">
                   {activeMode === 'kaline' ? <span className="text-[#FF4C1F]">K</span> : <span className="text-emerald-400 font-mono text-xs">&lt;/&gt;</span>}
                 </div>
              </button>

              {/* Attachment Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-11 h-11 rounded-full border border-[#FF4C1F]/30 hover:bg-[#FF4C1F]/10 hover:border-[#FF4C1F] flex items-center justify-center text-[#FF4C1F] transition-all shrink-0"
                title="Anexar arquivo (Imagem/PDF/Câmera)"
              >
                <Paperclip className="w-4.5 h-4.5" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,application/pdf" capture="environment" className="hidden" />

              {/* Middle Message Input fully rounded with branching git icon */}
`;

file = file.replace(inputTrayRegex, newInputTray.trim());

fs.writeFileSync('src/components/KalineChat.tsx', file);
