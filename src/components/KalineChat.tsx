import { GoogleGenAI } from '@google/genai';
import React, { useState, useRef, useEffect } from 'react';
import { cacheStatsTracker } from '../lib/CacheStatsTracker';
import { buildIdentityContext, isV27CodeRequest, V27_CODE_RESPONSE } from '../lib/identityDocs';
import { addSedimentCandidate, listSediments } from '../lib/sedimentation';
import type { Sediment } from '../lib/sedimentation';
import KittScanner, { KittState } from './KittScanner';
import { 
  Sparkles, 
  Send, 
  Terminal, 
  Laptop, 
  Smartphone,
  Network,
  Code, 
  Check, 
  Copy, 
  Layers, 
  Zap, 
  RefreshCw,
  Eye,
  Fingerprint,
  MessageSquare,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  HelpCircle,
  Leaf,
  Trash2,
  Plus,
  ArrowRight,
  Clock,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  Paperclip,
  GitBranch,
  Settings
} from 'lucide-react';

interface Message {
  sender: 'user' | 'system' | 'kaline' | 'kharis' | 'kuan';
  text: string;
  timestamp: string;
  filteredPrompt?: string;
  proposedSemaphore?: 'green' | 'yellow' | 'blue' | 'red'; // For inline action confirmation
  promptCached?: boolean;
  semanticCached?: boolean;
}



export const PRESENCA_META = {
  green: {
    label: 'Verde',
    desc: 'Fluxo aberto',
    detail: 'Médio/longo, propor, plano, até 3 caminhos',
    color: 'bg-emerald-500',
    ring: 'ring-emerald-500/30',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/10'
  },
  yellow: {
    label: 'Amarelo',
    desc: 'Atenção mediada',
    detail: 'Curto-médio, menos densidade, até 2 caminhos',
    color: 'bg-amber-500',
    ring: 'ring-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/10'
  },
  blue: {
    label: 'Azul',
    desc: 'Presença calma',
    detail: 'Resposta curta, 1 caminho guiado, sem excesso ou menu',
    color: 'bg-blue-500',
    ring: 'ring-blue-500/30',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10'
  },
  red: {
    label: 'Vermelho',
    desc: 'Limite ativo',
    detail: 'Muito curta, 0 opções, sem decisões complexas ou projetos',
    color: 'bg-red-500',
    ring: 'ring-red-500/30',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]',
    text: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/10'
  }
};

export default function KalineChat() {
  const [activeMode, setActiveMode] = useState<'kaline' | 'kharis' | 'kuan'>(() => {
    const saved = localStorage.getItem('kaline_active_dialogue_facet');
    if (saved === 'kharis') return 'kharis';
    if (saved === 'kuan') return 'kuan';
    return 'kaline';
  });

  useEffect(() => {
    const valueToSave = activeMode;
    localStorage.setItem('kaline_active_dialogue_facet', valueToSave);
    // Dispatch event so ModoFalaPanel and GuardiaoPanel can update if they are listening
    window.dispatchEvent(new CustomEvent('kalineActiveFacetChanged', { detail: valueToSave }));
  }, [activeMode]);

  const t = activeMode === 'kaline' ? {
    bg: 'bg-[#FF4C1F]', bg10: 'bg-[#FF4C1F]/10', bg15: 'bg-[#FF4C1F]/15', bg5: 'bg-[#FF4C1F]/5',
    border: 'border-[#FF4C1F]', border10: 'border-[#FF4C1F]/10', border15: 'border-[#FF4C1F]/15', border20: 'border-[#FF4C1F]/20', border30: 'border-[#FF4C1F]/30', border35: 'border-[#FF4C1F]/35', border40: 'border-[#FF4C1F]/40', border5: 'border-[#FF4C1F]/5',
    from: 'from-[#FF4C1F]', toHover: 'to-[#FF7A3D]',
    text: 'text-[#FF4C1F]', text60: 'text-[#FF4C1F]/60', hoverText: 'hover:text-[#FF4C1F]', hoverBg: 'hover:bg-[#FF4C1F]/10', hoverBorder: 'hover:border-[#FF4C1F]', hoverBgHover: 'hover:bg-[#FF7A3D]',
    ring30: 'focus:ring-[#FF4C1F]/30', focusBorder: 'focus:border-[#FF4C1F]',
    shadow12: 'shadow-[0_0_12px_rgba(255,76,31,0.35)]', shadow8: 'shadow-[0_0_8px_rgba(255,76,31,0.2)]', shadow16: 'shadow-[0_0_16px_rgba(239,68,68,0.5)]',
    avatarFrom: 'from-[#120306]', avatarTo: 'to-[#1A0609]', bubbleSelf: 'bg-[#180A06]/95', bubbleOther: 'bg-[#0E1015]/95',
    tagName: 'KALINE', tagAvatar: 'K', tagImage: '/brand/kaline.png',
    modeName: 'Kaline (Conversa)', modeIcon: <span className="text-[#FF4C1F]">K</span>
  } : activeMode === 'kharis' ? {
    bg: 'bg-[#E0A84E]', bg10: 'bg-[#E0A84E]/10', bg15: 'bg-[#E0A84E]/15', bg5: 'bg-[#E0A84E]/5',
    border: 'border-[#E0A84E]', border10: 'border-[#E0A84E]/10', border15: 'border-[#E0A84E]/15', border20: 'border-[#E0A84E]/20', border30: 'border-[#E0A84E]/30', border35: 'border-[#E0A84E]/35', border40: 'border-[#E0A84E]/40', border5: 'border-[#E0A84E]/5',
    from: 'from-[#E0A84E]', toHover: 'to-[#C49242]',
    text: 'text-[#E0A84E]', text60: 'text-[#E0A84E]/60', hoverText: 'hover:text-[#E0A84E]', hoverBg: 'hover:bg-[#E0A84E]/10', hoverBorder: 'hover:border-[#E0A84E]', hoverBgHover: 'hover:bg-[#C49242]',
    ring30: 'focus:ring-[#E0A84E]/30', focusBorder: 'focus:border-[#E0A84E]',
    shadow12: 'shadow-[0_0_12px_rgba(224,168,78,0.35)]', shadow8: 'shadow-[0_0_8px_rgba(224,168,78,0.2)]', shadow16: 'shadow-[0_0_16px_rgba(224,168,78,0.5)]',
    avatarFrom: 'from-[#4A2706]', avatarTo: 'to-[#2A1603]', bubbleSelf: 'bg-[#251303]/95', bubbleOther: 'bg-[#0E1015]/95',
    tagName: 'KHÁRIS', tagAvatar: 'KH', tagImage: '/brand/kharis.png',
    modeName: 'Kháris (Cuidado e Simplicidade)', modeIcon: <span className="text-[#E0A84E] font-serif">KH</span>
  } : {
    bg: 'bg-[#C98A65]', fill: 'fill-[#C98A65]', bg10: 'bg-[#C98A65]/10', bg15: 'bg-[#C98A65]/15', bg5: 'bg-[#C98A65]/5',
    border: 'border-[#C98A65]', border10: 'border-[#C98A65]/10', border15: 'border-[#C98A65]/15', border20: 'border-[#C98A65]/20', border30: 'border-[#C98A65]/30', border35: 'border-[#C98A65]/35', border40: 'border-[#C98A65]/40', border5: 'border-[#C98A65]/5',
    from: 'from-[#2A1603]', toHover: 'to-[#D9A47E]',
    text: 'text-[#C98A65]', text60: 'text-[#C98A65]/60', hoverText: 'hover:text-[#C98A65]', hoverBg: 'hover:bg-[#C98A65]/10', hoverBorder: 'hover:border-[#C98A65]', hoverBgHover: 'hover:bg-[#D9A47E]',
    ring30: 'focus:ring-[#C98A65]/30', focusBorder: 'focus:border-[#C98A65]',
    shadow12: 'shadow-[0_0_12px_rgba(201,138,101,0.35)]', shadow8: 'shadow-[0_0_8px_rgba(201,138,101,0.2)]', shadow16: 'shadow-[0_0_16px_rgba(201,138,101,0.5)]',
    avatarFrom: 'from-[#2A1603]', avatarTo: 'to-[#140B02]', bubbleSelf: 'bg-[#1B0E05]/95', bubbleOther: 'bg-[#0E1015]/95',
    tagName: 'KUAN', tagAvatar: 'KU', tagImage: '/brand/kaline.png',
    modeName: 'Kuan (Comercial)', modeIcon: <span className="text-[#C98A65] font-serif">KU</span>
  };

  const [ollamaUrl, setOllamaUrl] = useState<string>('http://localhost:11434');
  const [isLocalMode, setIsLocalMode] = useState<boolean>(true);
  const [ollamaConnected, setOllamaConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');

  // Twin Engine State: V27 (Mobile) vs V27b (Desktop)
  const [kalineVersion, setKalineVersion] = useState<'V27' | 'V27b'>(() => {
    return (localStorage.getItem('kaline_version') as 'V27' | 'V27b') || 'V27';
  });

  useEffect(() => {
    const handleVersionChange = (e: any) => {
      setKalineVersion(e.detail);
    };
    window.addEventListener('kalineVersionChanged', handleVersionChange);
    return () => window.removeEventListener('kalineVersionChanged', handleVersionChange);
  }, []);
  const [cloudflareWorkerUrl, setCloudflareWorkerUrl] = useState<string>(() => {
    return localStorage.getItem('kaline_cloudflare_worker_url') || 'https://kaline-worker.workers.dev';
  });
  const [openrouterKey, setOpenrouterKey] = useState<string>(() => {
    return localStorage.getItem('kaline_openrouter_key') || '';
  });

  // Semaphore (Semáforo) State synced with localStorage
  const [presencaRegime, setPresencaRegime] = useState<'green' | 'yellow' | 'blue' | 'red'>(() => {
    return (localStorage.getItem('kaline_presenca_regime') as any) || 'green';
  });
  const [notaEfemera, setNotaEfemera] = useState<string>(() => {
    return localStorage.getItem('kaline_nota_efemera') || '';
  });

  // User Profile States
  const [userNickname, setUserNickname] = useState<string>(() => {
    return localStorage.getItem('kaline_user_nickname') || 'Ká';
  });
  const [userPronouns, setUserPronouns] = useState<string>(() => {
    return localStorage.getItem('kaline_user_pronouns') || 'ele/dele';
  });
  const [userPhoto, setUserPhoto] = useState<string>(() => {
    return localStorage.getItem('kaline_user_photo') || '';
  });

  // Conversation Context Summary state
  const [threadSummary, setThreadSummary] = useState<{
    summary: string;
    currentGoal: string;
    lastDecision: string;
    openLoops: string;
    toneHint: string;
  }>(() => {
    const stored = localStorage.getItem('kaline_thread_summary');
    return stored ? JSON.parse(stored) : {
      summary: 'Arquitetura do Pritaneu',
      currentGoal: 'Integrar os controles de Semáforo da Kaline e resumos contextuais de thread',
      lastDecision: 'Usar localStorage para persistência de estado e modulação local',
      openLoops: 'Criar componente interativo de popover para o Semáforo',
      toneHint: 'Direto, claro, adulto'
    };
  });

  // Sidebar dynamic tab: 'sediments' or 'summary'
  const [sidebarTab, setSidebarTab] = useState<'sediments' | 'summary'>('summary');

  // Sync state with localStorage
  useEffect(() => {
    const syncState = () => {
      const currentRegime = (localStorage.getItem('kaline_presenca_regime') as any) || 'green';
      const currentNota = localStorage.getItem('kaline_nota_efemera') || '';
      setPresencaRegime(currentRegime);
      setNotaEfemera(currentNota);

      setUserNickname(localStorage.getItem('kaline_user_nickname') || 'Ká');
      setUserPronouns(localStorage.getItem('kaline_user_pronouns') || 'ele/dele');
      setUserPhoto(localStorage.getItem('kaline_user_photo') || '');

      setKalineVersion((localStorage.getItem('kaline_version') as 'V27' | 'V27b') || 'V27');
      setCloudflareWorkerUrl(localStorage.getItem('kaline_cloudflare_worker_url') || 'https://kaline-worker.workers.dev');
      setOpenrouterKey(localStorage.getItem('kaline_openrouter_key') || '');

      const storedSum = localStorage.getItem('kaline_thread_summary');
      if (storedSum) {
        setThreadSummary(JSON.parse(storedSum));
      }
    };
    // Initial sync
    syncState();
    // Keep checking changes from global top bar
    const interval = setInterval(syncState, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('kaline_presenca_regime', presencaRegime);
  }, [presencaRegime]);

  useEffect(() => {
    localStorage.setItem('kaline_nota_efemera', notaEfemera);
  }, [notaEfemera]);

  useEffect(() => {
    localStorage.setItem('kaline_version', kalineVersion);
  }, [kalineVersion]);

  useEffect(() => {
    localStorage.setItem('kaline_cloudflare_worker_url', cloudflareWorkerUrl);
  }, [cloudflareWorkerUrl]);

  useEffect(() => {
    localStorage.setItem('kaline_openrouter_key', openrouterKey);
  }, [openrouterKey]);

  useEffect(() => {
    localStorage.setItem('kaline_thread_summary', JSON.stringify(threadSummary));
  }, [threadSummary]);
  
  // Pipeline tracking states
  const [pipelineStep, setPipelineStep] = useState<'idle' | 'filtering' | 'generating' | 'done'>('idle');
  const [tempFiltered, setTempFiltered] = useState<string>('');

  // Audio / Speech States (STT & TTS)
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speakingMessageIdx, setSpeakingMessageIdx] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Collapsible Setup Panel (Identity & Connection)
  const [showSetup, setShowSetup] = useState<boolean>(false);

  // Collapsible Sediments Panel
  const [showSedimentPanel, setShowSedimentPanel] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  const [sediments, setSediments] = useState<Sediment[]>([]);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'kaline',
      text: 'Olá! Sou a Kaline. Meu canal de presença está pronto para conversar com identidade canônica e contexto real disponível.',
      timestamp: '05:43'
    }
  ]);

  
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  
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
        text: `[Arquivo Anexado: ${file.name}]`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, fileMsg]);
      setLoading(true);

      try {
        const geminiKey = localStorage.getItem('kaline_gemini_key');
        if (!geminiKey) {
           throw new Error("Chave Gemini não configurada");
        }
        const ai = new GoogleGenAI({ apiKey: geminiKey });

        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
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
        
        setMessages(prev => [...prev, reply]);
      } catch (err: any) {
         console.error(err);
         const errMsg: Message = {
           sender: activeMode,
           text: "[Erro ao processar arquivo: " + err.message + "]",
           timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
         };
         setMessages(prev => [...prev, errMsg]);
      } finally {
         setLoading(false);
         if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
  };

  // Load active contexts from localStorage to inspect and show in the prompt UI
  const [activeContexts, setActiveContexts] = useState<any[]>([]);

  // Load active contexts
  const loadActiveContexts = () => {
    try {
      const stored = localStorage.getItem('kaline_contexts');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((c: any) => c.ativo && !c.arquivado);
        setActiveContexts(filtered);
      } else {
        // Fallback default
        setActiveContexts([
          { titulo: 'Kaline — Voz e modo de falar', tipo: 'identidade' },
          { titulo: 'Ká — Preferências de resposta', tipo: 'memoria_relacional' },
          { titulo: 'Ecossistema Kaline — Ontologia geral', tipo: 'identidade' }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load and sync sediments through the sedimentation service.
  const loadSediments = async () => {
    try {
      setSediments(await listSediments());
    } catch (e) {
      console.warn('Erro ao ler sedimentos locais', e);
      setSediments([]);
    }
  };

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
      } catch (err: any) {
        console.error('Falha ao iniciar microfone', err);
        if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
           setInput(prev => prev + " [Acesso ao microfone negado]");
        } else {
           setInput(prev => prev + " [Erro ao iniciar microfone]");
        }
        setIsListening(false);
      }
    }
  };

  // Handle TTS (Speech Synthesis)
  const handleSpeak = (text: string, idx: number, sender: string) => {
    if (speakingMessageIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingMessageIdx(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setSpeakingMessageIdx(null);
      utterance.onerror = () => setSpeakingMessageIdx(null);
      
      // Select a natural PT voice if available
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice;
      if (sender === 'kharis') {
        selectedVoice = voices.find(v => v.name.includes('Despina'));
      } else {
        selectedVoice = voices.find(v => v.name.includes('Aoede'));
      }
      
      if (!selectedVoice) {
        selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (sender === 'kharis' ? v.name.includes('Despina') : v.name.includes('Aoede')));
      }

      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt-'));
      }
      
      if (selectedVoice) utterance.voice = selectedVoice;
      // Aplicar estilos de voz
      const voiceStyle = localStorage.getItem('kaline_voice_style') || 'direta';
      let basePitch = sender === 'kharis' ? 1.0 : 1.1;
      
      if (voiceStyle === 'formal') {
        utterance.pitch = Math.max(0.1, basePitch - 0.2);
        utterance.rate = 0.9;
      } else if (voiceStyle === 'calorosa') {
        utterance.pitch = Math.min(2.0, basePitch + 0.15);
        utterance.rate = 0.95;
      } else {
        utterance.pitch = basePitch;
        utterance.rate = 1.05;
      }
      
      window.speechSynthesis.speak(utterance);
      setSpeakingMessageIdx(idx);
    }
  };

  // Clear TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    loadActiveContexts();
    void loadSediments();
    const interval = setInterval(() => {
      loadActiveContexts();
      void loadSediments();
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeMode]);

  // Check Ollama status
  const checkOllama = async () => {
    try {
      const res = await fetch(`${ollamaUrl}/api/tags`);
      if (res.ok) setOllamaConnected(true);
      else setOllamaConnected(false);
    } catch {
      setOllamaConnected(false);
    }
  };

  useEffect(() => {
    checkOllama();
  }, [ollamaUrl]);

  // Real AI fetch pipeline
  const processMessage = async (userText: string) => {
    setLoading(true);

    const lowerText = userText.toLowerCase();

    if (isV27CodeRequest(userText)) {
      setMessages(prev => [
        ...prev,
        {
          sender: activeMode,
          text: V27_CODE_RESPONSE,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setLoading(false);
      setPipelineStep('done');
      return;
    }



    setPipelineStep('filtering');
    setTempFiltered('');

    // Load active context strings to form the prompt hierarchy
    let contextBlock = buildIdentityContext(userText, activeMode);
    try {
      const stored = localStorage.getItem('kaline_contexts');
      const parsed = stored ? JSON.parse(stored) : [];
      const active = parsed.filter((c: any) => c.ativo && !c.arquivado);
      if (active.length > 0) {
        contextBlock += '\n\n[CONTEXTOS LOCAIS ATIVOS - NÃO CANÔNICOS]\n' + active.map((c: any) => `[CONTEXTO ${c.tipo.toUpperCase()}: ${c.titulo}]\n${c.conteudo}`).join('\n\n');
      }
    } catch (e) {
      console.warn('Erro ao ler contextos', e);
    }

    // Parse natural language commands for Semaphore
    let proposedSem: 'green' | 'yellow' | 'blue' | 'red' | undefined = undefined;
    if (lowerText.includes('vermelho') && (lowerText.includes('estou') || lowerText.includes('muda') || lowerText.includes('semáforo') || lowerText.includes('energia') || lowerText.includes('limite'))) {
      proposedSem = 'red';
    } else if (lowerText.includes('verde') && (lowerText.includes('estou') || lowerText.includes('muda') || lowerText.includes('semáforo') || lowerText.includes('fluxo') || lowerText.includes('foco'))) {
      proposedSem = 'green';
    } else if (lowerText.includes('amarelo') && (lowerText.includes('estou') || lowerText.includes('muda') || lowerText.includes('semáforo') || lowerText.includes('atenção'))) {
      proposedSem = 'yellow';
    } else if (lowerText.includes('azul') && (lowerText.includes('estou') || lowerText.includes('muda') || lowerText.includes('semáforo') || lowerText.includes('calma') || lowerText.includes('baixo'))) {
      proposedSem = 'blue';
    }

    if (kalineVersion === 'V27') {
      setPipelineStep('generating');
      let filteredText = '[IA remota real] Preparando contexto canônico e pedido do usuário.';
      setTempFiltered(filteredText);
      let responseText = '';

      const geminiKey = localStorage.getItem('kaline_gemini_key');
        if (geminiKey) {
          try {
            const ai = new GoogleGenAI({ apiKey: geminiKey });
            const systemInstructionText = activeMode === 'kharis'
              ? `Você é a Kaline operando sob a faceta Kháris. Use a identidade canônica abaixo como fonte primária. Responda com cuidado simples, sem infantilizar.

${contextBlock}`
              : activeMode === 'kuan'
              ? `Você é a Kaline operando sob a faceta Kuan. Use a identidade canônica abaixo como fonte primária. Mostre apenas dado real ou estado vazio honesto.

${contextBlock}`
              : `Você é a Kaline. Use a identidade canônica abaixo como fonte primária. Seja direta, honesta e concisa.

${contextBlock}`;
            const response = await ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: [{ role: 'user', parts: [{ text: `Usuário: ${userText}` }] }],
              config: {
                systemInstruction: { parts: [{ text: systemInstructionText }] }
              }
            });
            responseText = response.text || '[Resposta vazia]';
          } catch (e) {
            responseText = '[Erro de rede com Gemini API]';
          }
        } else if (openrouterKey) {
          try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${openrouterKey}`,
              },
              body: JSON.stringify({
                model: 'google/gemini-2.5-flash-lite',
                messages: [
                  { role: 'system', content: `${activeMode === 'kharis' ? 'Você é a Kaline sob a faceta Kháris.' : activeMode === 'kuan' ? 'Você é a Kaline sob a faceta Kuan.' : 'Você é a Kaline.'} Use a identidade canônica como fonte primária. Não finja infraestrutura.

${contextBlock}` },
                  { role: 'user', content: userText },
                ],
              }),
            });
            if (!response.ok) throw new Error(`OpenRouter HTTP ${response.status}`);
            const data = await response.json();
            responseText = data?.choices?.[0]?.message?.content?.trim() || '[Resposta vazia]';
          } catch (e) {
            responseText = '[Erro de rede com OpenRouter API]';
          }
        } else {
          responseText = 'Chat online indisponível: IA não configurada neste ambiente.';
        }

      if (proposedSem) {
        const colorLabels = { green: 'Verde (Fluxo Aberto)', yellow: 'Amarelo (Atenção Mediada)', blue: 'Azul (Presença Calma)', red: 'Vermelho (Limite Ativo)' };
        responseText += `

[AÇÃO SUGERIDA]: Identifiquei que você pode querer mudar o Semáforo de presença para o regime ${colorLabels[proposedSem]}. Deseja confirmar?`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: activeMode,
          text: responseText,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          filteredPrompt: filteredText,
          proposedSemaphore: proposedSem,
          promptCached: false
        }
      ]);
      setLoading(false);
      setPipelineStep('done');
      return;
    }

    // Otherwise, Kaline V27b (Desktop): Local Ollama Mode
    const informalFilterPrompt = `Transforme o comando informal do usuário em um prompt ultra-estruturado, técnico, focado em hábitos e disciplina de desenvolvimento para a Kaline (Qwen 3B). Retorne APENAS o prompt estruturado final.\nUsuário disse: "${userText}"`;

    let filteredText = `PROMPT_ESTRUTURADO: Analisar engajamento com foco em disciplina de desenvolvimento sob Ollama Local.`;
    let responseText = 'Chat online indisponível: IA não configurada neste ambiente.';

    if (isLocalMode && ollamaConnected) {
      try {
        const filterRes = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen2.5:1.5b',
            prompt: informalFilterPrompt,
            stream: false
          })
        });
        if (filterRes.ok) {
          const filterData = await filterRes.json();
          filteredText = filterData.response.trim();
        }

        setTempFiltered(filteredText);
        setPipelineStep('generating');

        const systemName = activeMode === 'kharis' ? 'Kaline operando sob a faceta Kháris' : activeMode === 'kuan' ? 'Kaline operando sob a faceta Kuan' : 'a Kaline V27';
        const customPromptInstructions = activeMode === 'kharis'
          ? 'Seu foco é cuidado e simplicidade. Responda de forma direta, com clareza, gentileza e simplicidade absoluta, sem ser condescendente ou paternalista, de forma curta e acolhedora.'
          : activeMode === 'kuan'
          ? 'Seu foco é negócio, clientes, serviços, agenda comercial e atendimento. Mostre apenas dado real ou estado vazio honesto.'
          : 'Responda ao prompt de forma direta, sem condescendência ou empatia artificial.';

        const finalPrompt = `[DIRETIVAS OPERACIONAIS - DESKTOP OLLAMA]
Você é ${systemName}. ${customPromptInstructions}

[SEMÁFORO DE PRESENÇA ATIVO]
Regime atual: ${presencaRegime.toUpperCase()}
Modulação obrigatória de voz:
- VERDE: resposta média/longa, alta profundidade, pode propor, até 3 caminhos/soluções.
- AMARELO: resposta curta-médio, menos densidade, priorizar frentes, até 2 caminhos/soluções.
- AZUL: resposta curta, calma, baixa estimulação, 1 caminho guiado, sem menu, sem palestra.
- VERMELHO: resposta muito curta, contenção ativa, 0 opções novas, sem projetos novos, sem decisões complexas.

Nota de modulação local atual: ${notaEfemera || 'Nenhuma nota ativa.'}

[IDENTIDADE CANÔNICA E CONTEXTOS]
${contextBlock}

[PEDIDO ESTRUTURADO]
${filteredText}

Por favor, responda ao pedido estruturado baseando-se estritamente nos contextos e diretrizes acima.`;

        const chatRes = await fetch(`${ollamaUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'qwen2.5:latest',
            prompt: finalPrompt,
            stream: false
          })
        });

        if (chatRes.ok) {
          const chatData = await chatRes.json();
          responseText = chatData.response.trim();
        }
      } catch (err) {
        console.warn('Ollama local indisponível; sem resposta simulada.');
      }
    } else {
      filteredText = '[Ollama indisponível] Nenhuma chamada local real foi executada.';
      responseText = 'Chat online indisponível: IA não configurada neste ambiente.';
      setTempFiltered(filteredText);
      setPipelineStep('generating');
    }

    if (proposedSem) {
      const colorLabels = { green: 'Verde (Fluxo Aberto)', yellow: 'Amarelo (Atenção Mediada)', blue: 'Azul (Presença Calma)', red: 'Vermelho (Limite Ativo)' };
      responseText += `\n\n[AÇÃO SUGERIDA]: Identifiquei que você pode querer mudar o Semáforo de presença para o regime ${colorLabels[proposedSem]}. Deseja confirmar?`;
    }

    setMessages(prev => [
      ...prev,
      {
        sender: activeMode,
        text: responseText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        filteredPrompt: filteredText,
        proposedSemaphore: proposedSem,
        promptCached: false
      }
    ]);

    setPipelineStep('done');
    setLoading(false);

    if (userText.length > 25) {
      void saveSedimentCandidate(userText);
    }
  };

  const handleCrossTalk = async () => {
    if (loading) return;
    setLoading(true);
    setPipelineStep('generating');

    const systemMsg: Message = {
      sender: 'system',
      text: 'Chat online indisponível: IA não configurada neste ambiente.',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, systemMsg]);

    setLoading(false);
    setPipelineStep('done');
  };

  const saveSedimentCandidate = async (text: string) => {
    try {
      await addSedimentCandidate({
        text,
        source: 'chat',
        origin: {
          type: 'chat',
          facet: activeMode,
        },
      });
      await loadSediments();
    } catch (e) {
      console.warn('Erro ao salvar sedimento de conversa', e);
    }
  };


  
  useEffect(() => {
    const handleFacetChange = (e: any) => {
      const val = e.detail;
      setActiveMode(prev => {
        const next = val === 'kharis' ? 'kharis' : val === 'kuan' ? 'kuan' : 'kaline';
        return prev === next ? prev : next;
      });
    };
    window.addEventListener('kalineActiveFacetChanged', handleFacetChange);
    return () => window.removeEventListener('kalineActiveFacetChanged', handleFacetChange);
  }, []);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && (prev[0].text.includes('Olá! Sou a Kaline') || prev[0].text.includes('Olá! Sou a Kuan') || prev[0].text.includes('Olá! Sou a Kháris'))) {
        return [
          {
            sender: activeMode,
            text: activeMode === 'kaline' 
              ? 'Olá! Sou a Kaline. Meu canal de presença está pronto para conversar com identidade canônica e contexto real disponível.'
              : activeMode === 'kharis'
              ? 'Olá! Sou a Kháris. Meu canal de cuidado e simplicidade está ativo. Estou aqui para te apoiar com gentileza, clareza e acolhimento em cada passo.'
              : 'Olá! Sou a Kuan. Meu canal comercial está disponível para dados reais de guardiões, clientes, serviços, agenda e atendimento.',
            timestamp: prev[0].timestamp
          }
        ];
      }
      return prev;
    });
  }, [activeMode]);


  const getKittState = (): KittState => {
    if (isListening) return "listening";
    if (loading && pipelineStep === 'filtering') return "radar";
    if (loading && pipelineStep === 'generating') return "thinking";
    return "idle";
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
      setInput('');
      processMessage(userMsg.text);
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-[#F7EFE7] animate-fade-in h-full flex-1" id="kaline-ai-center">
      {/* LEFT CHAT SECTION (Main Area) */}
      <div className="lg:col-span-12 space-y-4 flex flex-col flex-1 pb-0 transition-all duration-300">
{/* Main Chat Interface */}
        <div className={`bg-[#0B0D12] rounded-[32px] border ${t.border}/15 shadow-2xl flex flex-col flex-1 min-h-[400px] overflow-hidden relative`}>
          
          
          
          
          {/* Chat window viewport */}
          <div className="p-4 pb-[110px] sm:pb-[110px] overflow-y-auto grow space-y-5 no-scrollbar bg-gradient-to-b from-[#090A0D] to-[#040507]">
            {messages.map((m, idx) => {
              const isSelf = m.sender === 'user';
              const mt = m.sender === 'kharis' ? {
                border: 'border-[#E0A84E]', border20: 'border-[#E0A84E]/20', border35: 'border-[#E0A84E]/35',
                text: 'text-[#E0A84E]', bg: 'bg-[#E0A84E]', fill: 'fill-[#E0A84E]',
                avatarFrom: 'from-[#4A2706]', avatarTo: 'to-[#2A1603]', bubbleOther: 'bg-[#0E1015]/95', bubbleSelf: 'bg-[#251303]/95',
                tagName: 'KHÁRIS', tagAvatar: 'KH', tagImage: '/brand/kharis.png', shadow8: 'shadow-[0_0_8px_rgba(224,168,78,0.2)]'
              } : m.sender === 'kuan' ? {
                border: 'border-[#C98A65]', border20: 'border-[#C98A65]/20', border35: 'border-[#C98A65]/35',
                text: 'text-[#C98A65]', bg: 'bg-[#C98A65]', fill: 'fill-[#C98A65]',
                avatarFrom: 'from-[#2A1603]', avatarTo: 'to-[#140B02]', bubbleOther: 'bg-[#0E1015]/95', bubbleSelf: 'bg-[#1B0E05]/95',
                tagName: 'KUAN', tagAvatar: 'KU', tagImage: '/brand/kaline.png', shadow8: 'shadow-[0_0_8px_rgba(201,138,101,0.2)]'
              } : {
                border: 'border-[#FF4C1F]', border20: 'border-[#FF4C1F]/20', border35: 'border-[#FF4C1F]/35',
                text: 'text-[#FF4C1F]', bg: 'bg-[#FF4C1F]', fill: 'fill-[#FF4C1F]',
                avatarFrom: 'from-[#120306]', avatarTo: 'to-[#1A0609]', bubbleOther: 'bg-[#0E1015]/95', bubbleSelf: 'bg-[#180A06]/95',
                tagName: 'KALINE', tagAvatar: 'K', tagImage: '/brand/kaline.png', shadow8: 'shadow-[0_0_8px_rgba(255,76,31,0.2)]'
              };
              
              return (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[88%] ${isSelf ? 'self-end ml-auto flex-row-reverse' : 'self-start flex-row'}`}
                >
                  {/* Avatar inside Bubble list - styled as perfect circles */}
                  {!isSelf ? (
                    <button 
                      onClick={() => setActiveMode(prev => prev === 'kaline' ? 'kharis' : prev === 'kharis' ? 'kuan' : 'kaline')}
                      title="Alternar Faceta (Kaline / Kháris / Kuan)"
                      className={`w-8 h-8 rounded-full border ${mt.border}/40 overflow-hidden bg-gradient-to-tr ${mt.avatarFrom} ${mt.avatarTo} flex items-center justify-center shrink-0 ${mt.shadow8} cursor-pointer hover:scale-105 active:scale-95 transition-transform`}
                    >
                      <img 
                        src={mt.tagImage} 
                        alt={mt.tagName} 
                        referrerPolicy="no-referrer" 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          (e.target as any).style.display = 'none';
                          if ((e.target as any).nextSibling) (e.target as any).nextSibling.style.display = 'flex';
                        }}
                      />
                      <span className={`hidden font-serif font-bold ${mt.text} text-xs`}>{mt.tagAvatar || mt.tagName.charAt(0)}</span>
                    </button>
                  ) : (
                    <div 
                      className={`w-8 h-8 rounded-full border ${t.border}/40 flex items-center justify-center shrink-0 overflow-hidden bg-[#10131A] text-xs font-bold ${t.text} shadow-md`}
                      title={`${userNickname} (${userPronouns})`}
                    >
                      {userPhoto ? (
                        <img src={userPhoto} alt={userNickname} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        userNickname.slice(0, 2).toUpperCase()
                      )}
                    </div>
                  )}

                  <div className="space-y-1 grow max-w-full">
                    {/* Header above bubble with elegant tag and integrated TTS audio widget */}
                    <div className={`flex items-center gap-2 mb-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[9px] font-black ${isSelf ? t.text : mt.text} font-serif tracking-[0.2em] uppercase`}>
                        {isSelf ? 'KÁ' : mt.tagName}
                      </span>
                      {!isSelf && (
                        <button 
                          onClick={() => handleSpeak(m.text, idx, m.sender)}
                          className={`flex items-center gap-2 px-3 py-1 bg-[#160B08] border ${mt.border}/30 rounded-full ${mt.text} hover:${mt.bg}/10 transition-all text-[9px] font-mono select-none shadow-sm`}
                          title="Ouvir Resposta Nativa (TTS)"
                        >
                          {speakingMessageIdx === idx ? (
                            <Pause className={`w-2.5 h-2.5 ${mt.text} ${mt.fill}`} />
                          ) : (
                            <Play className={`w-2.5 h-2.5 ${mt.text} ${mt.fill}`} />
                          )}
                          
                          {/* Equalizer lines faithful to the screenshot's wave lines */}
                          <div className="flex items-end gap-[1.5px] h-2.5 px-0.5">
                            {[1, 2, 3, 4, 5].map((bar) => {
                              const staticHeights = ['h-1', 'h-2', 'h-2.5', 'h-1.5', 'h-2'];
                              const speakAnimations = [
                                'animate-[bounce_0.8s_infinite_100ms]',
                                'animate-[bounce_0.7s_infinite_300ms]',
                                'animate-[bounce_0.9s_infinite_200ms]',
                                'animate-[bounce_0.6s_infinite_400ms]',
                                'animate-[bounce_0.8s_infinite_0ms]',
                              ];
                              return (
                                <div 
                                  key={bar} 
                                  className={`w-[1.5px] ${mt.bg} rounded-full transition-all ${
                                    speakingMessageIdx === idx ? speakAnimations[bar - 1] : staticHeights[bar - 1]
                                  }`} 
                                />
                              );
                            })}
                          </div>

                          <Volume2 className={`w-2.5 h-2.5 ${mt.text}`} />
                        </button>
                      )}
                    </div>

                    {/* Speech Bubble Box with dark background and thin orange borders */}
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed relative group border ${
                      isSelf 
                        ? `${t.bubbleSelf} ${t.border35} text-[#F7EFE7] rounded-tr-none` 
                        : `${t.bubbleOther} ${t.border}/20 text-[#F7EFE7] rounded-tl-none`
                    }`}>
                      {m.promptCached && (
                        <div className="mb-2 text-[8px] font-bold uppercase tracking-widest text-[#FF4C1F] flex items-center gap-1.5 opacity-80">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C1F] animate-pulse"></span>
                          Prompt Caching Ativo
                        </div>
                      )}
                      {m.semanticCached && (
                        <div className="mb-2 text-[8px] font-bold uppercase tracking-widest text-[#3B82F6] flex items-center gap-1.5 opacity-80">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse"></span>
                          Sedimento local
                        </div>
                      )}
                      <p className="whitespace-pre-wrap break-words">{m.text}</p>

                      {/* Proposed Semaphore action trigger */}
                      {m.proposedSemaphore && (
                        <div className={`mt-2.5 p-2.5 ${t.bg}/10 border ${t.border}/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2.5`}>
                          <span className="text-[10px] text-[#A89F96] leading-tight text-center sm:text-left">
                            Ativar o Semáforo <strong className={`${t.text}`}>{PRESENCA_META[m.proposedSemaphore].label}</strong> agora?
                          </span>
                          <button
                            onClick={() => {
                              const sem = m.proposedSemaphore!;
                              setPresencaRegime(sem);
                              localStorage.setItem('kaline_presenca_regime', sem);
                              // Trigger state update notification or confirmation
                              setMessages(prev => [
                                ...prev,
                                {
                                  sender: 'kaline',
                                  text: `Confirmado. Ativei o Semáforo ${PRESENCA_META[sem].label} (${PRESENCA_META[sem].desc}) conforme solicitado.`,
                                  timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                }
                              ]);
                            }}
                            className={`px-2.5 py-1 ${t.bg} ${t.hoverBgHover} text-[#06070A] font-black text-[9px] uppercase tracking-wider rounded-lg transition-all`}
                          >
                            Ativar {PRESENCA_META[m.proposedSemaphore].label}
                          </button>
                        </div>
                      )}



                    </div>

                    <div className={`flex items-center gap-2 text-[8px] text-[#A89F96]/60 font-mono ${isSelf ? 'justify-end' : 'justify-start'}`}>
                      <span>{m.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Active processing Pipeline Indicator */}
            {loading && (
              <div className="self-start max-w-[85%] space-y-2 pl-11">
                <div className={`p-3 bg-[#10131A] border ${t.border}/20 rounded-2xl rounded-tl-none text-xs text-[#A89F96]`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${t.bg} animate-ping`}></span>
                    <span className="font-bold text-[#F7EFE7] uppercase tracking-wider text-[8px] font-mono">
                      Processando...
                    </span>
                  </div>
                </div>
              </div>
            )}

            
            <div ref={chatEndRef} />
          </div>

          {/* Fixed bottom controls tray containing the KITT Progress Meter and message composer */}
          <div className={`absolute bottom-0 left-0 w-full bg-[#090A0D] border-t ${t.border}/10 z-10`}>
            {/* KITT Scanner */}
            <div className="flex justify-center items-center py-2 px-4 select-none bg-[#090A0D]/95">
              <KittScanner 
                state={getKittState()}
                variant="ruby"
                className="w-48 max-w-full"
                height={16}
                segments={8}
              />
            </div>

            {/* Input tray with STT Microphone integrated */}
            <div className={`p-3 border-t ${t.border}/10 bg-[#090A0D] flex gap-2 sm:gap-3 items-center`}>

              {/* Attachment Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`w-8 h-8 rounded-full border ${t.border}/30 hover:${t.bg}/10 hover:${t.border} flex items-center justify-center ${t.text} transition-all shrink-0`}
                title="Anexar arquivo (Imagem/PDF/Câmera)"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,application/pdf" className="hidden" />

              {/* Middle Message Input fully rounded with branching git icon */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                  placeholder="Mensagem"
                  className={`w-full text-xs pl-5 pr-20 py-3 border ${t.border}/30 rounded-full focus:outline-none focus:ring-1 ${t.ring30} focus:${t.border} text-[#F7EFE7] bg-[#0E0F12] placeholder-[#A89F96]/40`}
                  id="ai-message-input"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'fala' }))}
                    className={`${t.text}/60 hover:${t.text} hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer`}
                    title={activeMode === 'kharis' ? "Modo Voz (Kháris)" : activeMode === 'kuan' ? "Modo Voz (Kuan)" : "Modo Voz (Kaline)"}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'sedimentos' }))}
                    className={`${t.text}/60 hover:${t.text} hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer`}
                    title="Consultar Sedimentação (Atalho)"
                    id="chat-input-sediment-shortcut"
                  >
                    <GitBranch className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'branding' }))}
                    className={`${t.text}/60 hover:${t.text} hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer`}
                    title="Branding K∧LINE"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                  </button>
                </div>
              </div>

              {/* Smart Microphone / Send solid orange circle button on the right */}
              <button
                onClick={input.trim() ? handleSend : toggleListen}
                disabled={loading && !!input.trim()}
                className={`w-10 h-10 rounded-full ${t.bg} ${t.hoverBgHover} text-[#06070A] transition-all flex items-center justify-center shrink-0 ${t.shadow12} ${
                  isListening ? `animate-pulse bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]` : ''
                }`}
                id="ai-btn-action"
              >
                {input.trim() ? (
                  <Send className="w-4 h-4" />
                ) : isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
