const fs = require('fs');
let file = fs.readFileSync('src/components/CavernaEcoPanel.tsx', 'utf8');

const transcriptionCode = `
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const startAudioSession = async () => {
    const newSession: EcoSession = {
      id: \`sess-\${Date.now()}\`,
      title: 'Nova Sessão de Áudio',
      mode: 'audio',
      date: 'Agora',
      blocks: [
        { id: \`b-0\`, order: 1, startTime: '00:00', endTime: '...', status: 'current' }
      ],
      status: 'gravando'
    };
    setActiveSession(newSession);
    setCurrentView('audio-record');
    setRecordingTime(0);
    setIsRecording(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start(1000); // collect 1s chunks
    } catch(e) {
      console.error(e);
    }
  };

  const stopAudioSession = () => {
    setIsRecording(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          let base64data = reader.result as string;
          base64data = base64data.split(',')[1];

          if (activeSession) {
            const geminiKey = localStorage.getItem('kaline_gemini_key');
            let transcription = "Transcrevendo...";
            
            if (geminiKey) {
              try {
                const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=' + geminiKey, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{
                      parts: [
                        { text: "Por favor, transcreva o seguinte áudio:" },
                        { inlineData: { mimeType: 'audio/webm', data: base64data } }
                      ]
                    }]
                  })
                });
                const data = await res.json();
                if (data.candidates && data.candidates[0]) {
                  transcription = data.candidates[0].content.parts[0].text;
                }
              } catch(e) {
                console.error(e);
                transcription = "Erro na transcrição.";
              }
            } else {
              transcription = "Gemini API Key não configurada. Use o Painel Guardião.";
            }

            const finalBlocks = activeSession.blocks.map(b => 
              b.status === 'current' ? { ...b, endTime: formatTime(recordingTime), status: 'transcribed' as BlockStatus, transcription } : b
            );
            const updated = { ...activeSession, status: 'finalizada' as const, blocks: finalBlocks };
            setActiveSession(updated);
            setSessions(prev => [updated, ...prev]);
          }
        };
      };
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    } else {
        if (activeSession) {
          const finalBlocks = activeSession.blocks.map(b => 
            b.status === 'current' ? { ...b, endTime: formatTime(recordingTime), status: 'processing' as BlockStatus } : b
          );
          const updated = { ...activeSession, status: 'finalizada' as const, blocks: finalBlocks };
          setActiveSession(updated);
          setSessions([updated, ...sessions]);
        }
    }
  };
`;

file = file.replace(/  const startAudioSession = \(\) => {[\s\S]*?  };/, transcriptionCode.trim());
file = file.replace("import { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';");
if (!file.includes('import React')) {
  file = "import React from 'react';\n" + file;
}
fs.writeFileSync('src/components/CavernaEcoPanel.tsx', file);
