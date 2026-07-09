import React, { useEffect, useRef, useState } from 'react';
import { Send, Mic, MicOff, Volume2, Pause, Play, GitBranch } from 'lucide-react';
import { sendChatMessage, type ChatHistoryItem } from '../lib/chat/client';
import { buildIdentityContext, isV27CodeRequest, V27_CODE_RESPONSE } from '../lib/identityDocs';
import { addSedimentCandidate, listGardenMemories, listSediments, type FacetId, type GardenMemory, type Sediment } from '../lib/sedimentation';
import KittScanner, { KittState } from './KittScanner';

type Sender = 'user' | 'system' | FacetId;

interface Message {
  sender: Sender;
  text: string;
  timestamp: string;
}

const FACET_META: Record<FacetId, {
  name: string;
  avatar: string;
  image: string;
  color: string;
  border: string;
  bg: string;
  bubbleSelf: string;
  tag: string;
}> = {
  kaline: {
    name: 'Kaline',
    avatar: 'K',
    image: '/brand/kaline.png',
    color: 'text-[#FF4C1F]',
    border: 'border-[#FF4C1F]',
    bg: 'bg-[#FF4C1F]',
    bubbleSelf: 'bg-[#180A06]/95',
    tag: 'KALINE',
  },
  kharis: {
    name: 'Kháris',
    avatar: 'KH',
    image: '/brand/kharis.png',
    color: 'text-[#E0A84E]',
    border: 'border-[#E0A84E]',
    bg: 'bg-[#E0A84E]',
    bubbleSelf: 'bg-[#251303]/95',
    tag: 'KHÁRIS',
  },
  kuan: {
    name: 'Kuan',
    avatar: 'KU',
    image: '/brand/kaline.png',
    color: 'text-[#C98A65]',
    border: 'border-[#C98A65]',
    bg: 'bg-[#C98A65]',
    bubbleSelf: 'bg-[#1B0E05]/95',
    tag: 'KUAN',
  },
};

function now() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function initialText(facet: FacetId): string {
  if (facet === 'kharis') return 'Olá! Sou a Kháris. Posso responder em passos simples, sem infantilizar.';
  if (facet === 'kuan') return 'Olá! Sou a Kuan. Posso atender com dados comerciais reais disponíveis, sem inventar serviços, preços ou agenda.';
  return 'Olá! Sou a Kaline. Meu canal de presença está pronto para conversar com identidade canônica e contexto real disponível.';
}

function buildLocalContext(memories: GardenMemory[]): string | undefined {
  const approved = memories.filter(memory => !memory.archived).slice(0, 12);
  if (approved.length === 0) return undefined;
  return ['[JARDIM - MEMÓRIAS LOCAIS APROVADAS]', ...approved.map(memory => `- ${memory.title}: ${memory.content}`)].join('\n');
}

function historyFromMessages(messages: Message[]): ChatHistoryItem[] {
  return messages
    .filter(message => message.sender === 'user' || message.sender === 'kaline' || message.sender === 'kharis' || message.sender === 'kuan')
    .slice(-12)
    .map(message => ({ role: message.sender === 'user' ? 'user' : 'assistant', content: message.text }));
}

export default function KalineChat() {
  const [activeMode, setActiveMode] = useState<FacetId>(() => {
    const saved = localStorage.getItem('kaline_active_dialogue_facet');
    return saved === 'kharis' || saved === 'kuan' ? saved : 'kaline';
  });
  const [messages, setMessages] = useState<Message[]>([{ sender: activeMode, text: initialText(activeMode), timestamp: now() }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<'idle' | 'context' | 'generating' | 'done'>('idle');
  const [sediments, setSediments] = useState<Sediment[]>([]);
  const [gardenMemories, setGardenMemories] = useState<GardenMemory[]>([]);
  const [speakingMessageIdx, setSpeakingMessageIdx] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const meta = FACET_META[activeMode];

  useEffect(() => {
    localStorage.setItem('kaline_active_dialogue_facet', activeMode);
    window.dispatchEvent(new CustomEvent('kalineActiveFacetChanged', { detail: activeMode }));
  }, [activeMode]);

  useEffect(() => {
    const handleFacetChange = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (detail === 'kaline' || detail === 'kharis' || detail === 'kuan') setActiveMode(detail);
    };
    window.addEventListener('kalineActiveFacetChanged', handleFacetChange);
    return () => window.removeEventListener('kalineActiveFacetChanged', handleFacetChange);
  }, []);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender !== 'user') {
        return [{ sender: activeMode, text: initialText(activeMode), timestamp: prev[0].timestamp }];
      }
      return prev;
    });
  }, [activeMode]);

  useEffect(() => {
    const loadLocalState = async () => {
      try {
        const [nextSediments, nextMemories] = await Promise.all([listSediments(), listGardenMemories()]);
        setSediments(nextSediments);
        setGardenMemories(nextMemories);
      } catch (error) {
        console.warn('Erro ao ler contexto local de sedimentação', error);
      }
    };
    void loadLocalState();
    const id = window.setInterval(loadLocalState, 1500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const getKittState = (): KittState => {
    if (isListening) return 'listening';
    if (loading && pipelineStep === 'context') return 'radar';
    if (loading && pipelineStep === 'generating') return 'thinking';
    return 'idle';
  };

  const saveSedimentCandidate = async (text: string) => {
    try {
      await addSedimentCandidate({ text, source: 'chat', origin: { type: 'chat', facet: activeMode } });
      setSediments(await listSediments());
    } catch (error) {
      console.warn('Erro ao salvar sedimento de conversa', error);
    }
  };

  const processMessage = async (userText: string, conversation: Message[]) => {
    setLoading(true);
    setPipelineStep('context');

    if (isV27CodeRequest(userText)) {
      setMessages(prev => [...prev, { sender: activeMode, text: V27_CODE_RESPONSE, timestamp: now() }]);
      setPipelineStep('done');
      setLoading(false);
      return;
    }

    if (userText.length > 25) void saveSedimentCandidate(userText);

    const identityContext = buildIdentityContext(userText, activeMode);
    const localContext = buildLocalContext(gardenMemories);
    const history = historyFromMessages(conversation);

    setPipelineStep('generating');
    const result = await sendChatMessage({ message: userText, facet: activeMode, identityContext, localContext, history });

    const responseText = result.ok === true ? result.text : result.error;
    setMessages(prev => [...prev, { sender: activeMode, text: responseText, timestamp: now() }]);
    setPipelineStep('done');
    setLoading(false);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { sender: 'user', text, timestamp: now() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    void processMessage(text, nextMessages);
  };

  const toggleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput(prev => `${prev}${prev ? ' ' : ''}[Reconhecimento de voz não disponível neste navegador]`);
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.interimResults = false;
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript;
      if (text) setInput(prev => `${prev}${prev ? ' ' : ''}${text}`);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const handleSpeak = (text: string, idx: number) => {
    if (speakingMessageIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingMessageIdx(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.onend = () => setSpeakingMessageIdx(null);
    utterance.onerror = () => setSpeakingMessageIdx(null);
    window.speechSynthesis.speak(utterance);
    setSpeakingMessageIdx(idx);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-[#F7EFE7] animate-fade-in h-full flex-1" id="kaline-ai-center">
      <div className="lg:col-span-12 space-y-4 flex flex-col flex-1 pb-0 transition-all duration-300">
        <div className={`bg-[#0B0D12] rounded-[32px] border ${meta.border}/15 shadow-2xl flex flex-col flex-1 min-h-[400px] overflow-hidden relative`}>
          <div className="p-4 pb-[110px] overflow-y-auto grow space-y-5 no-scrollbar bg-gradient-to-b from-[#090A0D] to-[#040507]">
            {messages.map((message, idx) => {
              const isSelf = message.sender === 'user';
              const messageMeta = message.sender === 'kharis' || message.sender === 'kuan' || message.sender === 'kaline' ? FACET_META[message.sender] : meta;
              return (
                <div key={`${message.timestamp}-${idx}`} className={`flex gap-3 max-w-[88%] ${isSelf ? 'self-end ml-auto flex-row-reverse' : 'self-start flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full border ${messageMeta.border}/40 flex items-center justify-center shrink-0 overflow-hidden bg-[#10131A] text-xs font-bold ${messageMeta.color} shadow-md`}>
                    {isSelf ? 'KÁ' : <img src={messageMeta.image} alt={messageMeta.name} className="w-full h-full object-cover" onError={(event) => { (event.currentTarget as HTMLImageElement).style.display = 'none'; }} />}
                  </div>
                  <div className="space-y-1 grow max-w-full">
                    <div className={`flex items-center gap-2 mb-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[9px] font-black ${isSelf ? meta.color : messageMeta.color} font-serif tracking-[0.2em] uppercase`}>
                        {isSelf ? 'KÁ' : messageMeta.tag}
                      </span>
                      {!isSelf && (
                        <button onClick={() => handleSpeak(message.text, idx)} className={`flex items-center gap-2 px-3 py-1 bg-[#160B08] border ${messageMeta.border}/30 rounded-full ${messageMeta.color} transition-all text-[9px] font-mono select-none shadow-sm`} title="Ouvir resposta">
                          {speakingMessageIdx === idx ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                          <Volume2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed relative group border ${isSelf ? `${meta.bubbleSelf} ${meta.border}/35 text-[#F7EFE7] rounded-tr-none` : `bg-[#0E1015]/95 ${messageMeta.border}/20 text-[#F7EFE7] rounded-tl-none`}`}>
                      <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    </div>
                    <div className={`flex items-center gap-2 text-[8px] text-[#A89F96]/60 font-mono ${isSelf ? 'justify-end' : 'justify-start'}`}>
                      <span>{message.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="self-start max-w-[85%] space-y-2 pl-11">
                <div className={`p-3 bg-[#10131A] border ${meta.border}/20 rounded-2xl rounded-tl-none text-xs text-[#A89F96]`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.bg} animate-ping`} />
                    <span className="font-bold text-[#F7EFE7] uppercase tracking-wider text-[8px] font-mono">
                      {pipelineStep === 'context' ? 'Preparando contexto...' : 'Consultando IA...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className={`absolute bottom-0 left-0 w-full bg-[#090A0D] border-t ${meta.border}/10 z-10`}>
            <div className="flex justify-center items-center py-2 px-4 select-none bg-[#090A0D]/95">
              <KittScanner state={getKittState()} variant="ruby" className="w-48 max-w-full" height={16} segments={8} />
            </div>
            <div className={`p-3 border-t ${meta.border}/10 bg-[#090A0D] flex gap-2 sm:gap-3 items-center`}>
              <div className="flex gap-1">
                {(['kaline', 'kharis', 'kuan'] as FacetId[]).map(facet => (
                  <button key={facet} onClick={() => setActiveMode(facet)} className={`px-3 py-2 rounded-full border text-[9px] font-black uppercase tracking-wider ${activeMode === facet ? `${FACET_META[facet].bg} text-[#06070A] ${FACET_META[facet].border}` : `bg-[#0E0F12] ${FACET_META[facet].border}/30 ${FACET_META[facet].color}`}`}>
                    {FACET_META[facet].tag}
                  </button>
                ))}
              </div>
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                  disabled={loading}
                  placeholder={`Mensagem para ${meta.name}`}
                  className={`w-full text-xs pl-5 pr-12 py-3 border ${meta.border}/30 rounded-full focus:outline-none focus:ring-1 focus:ring-[#FF4C1F]/30 text-[#F7EFE7] bg-[#0E0F12] placeholder-[#A89F96]/40`}
                  id="ai-message-input"
                />
                <button onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'sedimentos' }))} className={`absolute right-4 top-1/2 -translate-y-1/2 ${meta.color}/60 hover:${meta.color} transition-all`} title={`Sedimentos locais: ${sediments.length}`}>
                  <GitBranch className="w-4 h-4" />
                </button>
              </div>
              <button onClick={input.trim() ? handleSend : toggleListen} disabled={loading && !!input.trim()} className={`w-10 h-10 rounded-full ${meta.bg} text-[#06070A] transition-all flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,76,31,0.35)] ${isListening ? 'animate-pulse bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : ''}`} id="ai-btn-action">
                {input.trim() ? <Send className="w-4 h-4" /> : isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
