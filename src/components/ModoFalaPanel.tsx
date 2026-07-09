
import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, RotateCcw, Volume2, MessageSquare, Paperclip, Activity, Settings } from 'lucide-react';

export type KlioVoiceState = 'idle' | 'recording' | 'transcribing' | 'thinking' | 'speaking' | 'done' | 'error';
export type ActiveMode = 'kaline' | 'klio' | 'kharis';
export type VoiceStyle = 'direta' | 'calorosa' | 'formal';

interface Message {
  id: string;
  sender: 'me' | 'agent';
  text: string;
}

export default function ModoFalaPanel({ onClose }: { onClose: () => void }) {
  const [activeMode, setActiveMode] = useState<ActiveMode>(() => {
    const saved = localStorage.getItem('kaline_active_dialogue_facet');
    if (saved === 'kharis') return 'kharis';
    if (saved === 'klio') return 'klio';
    return 'kaline';
  });

  useEffect(() => {
    localStorage.setItem('kaline_active_dialogue_facet', activeMode);
    window.dispatchEvent(new CustomEvent('kalineActiveFacetChanged', { detail: activeMode }));
  }, [activeMode]);

  useEffect(() => {
    const handleFacetChange = (e: any) => {
      const val = e.detail;
      setActiveMode(prev => {
        const next = val === 'kharis' ? 'kharis' : val === 'klio' ? 'klio' : 'kaline';
        return prev === next ? prev : next;
      });
    };
    window.addEventListener('kalineActiveFacetChanged', handleFacetChange);
    return () => window.removeEventListener('kalineActiveFacetChanged', handleFacetChange);
  }, []);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>(() => {
    return (localStorage.getItem('kaline_voice_style') as VoiceStyle) || 'direta';
  });

  useEffect(() => {
    localStorage.setItem('kaline_voice_style', voiceStyle);
  }, [voiceStyle]);

  const [currentState, setCurrentState] = useState<KlioVoiceState>('idle');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  const historyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = activeMode === 'kaline' ? {
    primary: '#FF4C1F',
    primaryClass: 'text-[#FF4C1F]',
    primaryBgClass: 'bg-[#FF4C1F]',
    primaryBg10: 'bg-[#FF4C1F]/10',
    primaryBg20: 'bg-[#FF4C1F]/20',
    primaryBorder20: 'border-[#FF4C1F]/20',
    primaryBorder30: 'border-[#FF4C1F]/30',
    primaryBorder50: 'border-[#FF4C1F]/50',
    hoverPrimaryBg20: 'hover:bg-[#FF4C1F]/20',
    title: 'Kaline',
    subtitle: 'Motor de Fala Ativo'
  } : activeMode === 'kharis' ? {
    primary: '#E0A84E',
    primaryClass: 'text-[#E0A84E]',
    primaryBgClass: 'bg-[#E0A84E]',
    primaryBg10: 'bg-[#E0A84E]/10',
    primaryBg20: 'bg-[#E0A84E]/20',
    primaryBorder20: 'border-[#E0A84E]/20',
    primaryBorder30: 'border-[#E0A84E]/30',
    primaryBorder50: 'border-[#E0A84E]/50',
    hoverPrimaryBg20: 'hover:bg-[#E0A84E]/20',
    title: 'Kháris',
    subtitle: 'Motor de Fala Ativo'
  } : {
    primary: '#E50914',
    primaryClass: 'text-[#E50914]',
    primaryBgClass: 'bg-[#E50914]',
    primaryBg10: 'bg-[#E50914]/10',
    primaryBg20: 'bg-[#E50914]/20',
    primaryBorder20: 'border-[#E50914]/20',
    primaryBorder30: 'border-[#E50914]/30',
    primaryBorder50: 'border-[#E50914]/50',
    hoverPrimaryBg20: 'hover:bg-[#E50914]/20',
    title: 'Klio',
    subtitle: 'Motor de Fala Ativo'
  };
  
  const STATES = {
    idle:         { text: 'Toque para falar',   icon: Mic,      color: 'text-[#F7EFE7]', bg: `${t.primaryBg10} ${t.hoverPrimaryBg20}`, border: t.primaryBorder20 },
    recording:    { text: 'Ouvindo...',         icon: Square,   color: t.primaryClass, bg: `${t.primaryBg20} animate-pulse`, border: t.primaryBorder50 },
    transcribing: { text: 'Transcrevendo...',   icon: Activity, color: 'text-[#A89F96]', bg: 'bg-[#252936]', border: 'border-[#252936]' },
    thinking:     { text: 'Pensando...',        icon: Activity, color: 'text-[#A89F96]', bg: 'bg-[#252936]', border: 'border-[#252936]' },
    speaking:     { text: 'Falando',            icon: Volume2,  color: t.primaryClass, bg: t.primaryBg10, border: t.primaryBorder30 },
    done:         { text: 'Toque para falar',   icon: Mic,      color: 'text-[#F7EFE7]', bg: `${t.primaryBg10} ${t.hoverPrimaryBg20}`, border: t.primaryBorder20 },
    error:        { text: 'Tentar novamente',   icon: RotateCcw,color: 'text-red-400',   bg: 'bg-red-500/10 hover:bg-red-500/20', border: 'border-red-500/20' }
  };
  
  const cfg = STATES[currentState];

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, isDrawerOpen]);

  const runFlow = () => {
    setCurrentState('transcribing');
    setTimeout(() => {
      setCurrentState('thinking');
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'me', text: 'Você falou: Me ajuda com a tarefa.' }]);
        setTimeout(() => {
          setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'agent', text: 'Claro. Vou te ajudar com calma, passo por passo.' }]);
          setCurrentState('speaking');
          setTimeout(() => {
            setCurrentState('done');
          }, 3000);
        }, 520);
      }, 950);
    }, 780);
  };

  const handleMainClick = () => {
    if (['idle', 'done', 'error'].includes(currentState)) {
      setCurrentState('recording');
    } else if (currentState === 'recording') {
      runFlow();
    } else if (currentState === 'speaking') {
      setCurrentState('done');
    }
  };

  const handleSendText = () => {
    const v = inputValue.trim();
    if (!v) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'me', text: v }]);
    setInputValue('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'agent', text: 'Entendido.' }]);
    }, 650);
  };

  const replayMessage = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice;
    
    if (activeMode === 'klio') {
      selectedVoice = voices.find(v => v.name.includes('Vindemiatrix'));
    } else if (activeMode === 'kharis') {
      selectedVoice = voices.find(v => v.name.includes('Despina'));
    } else {
      selectedVoice = voices.find(v => v.name.includes('Aoede'));
    }
    
    if (!selectedVoice) {
      selectedVoice = voices.find(v => (v.lang.includes('pt-BR') || v.lang.includes('pt-')) && (activeMode === 'klio' ? v.name.includes('Vindemiatrix') : activeMode === 'kharis' ? v.name.includes('Despina') : v.name.includes('Aoede')));
    }
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt-'));
    }
    
    let basePitch = activeMode === 'klio' ? 0.9 : activeMode === 'kharis' ? 1.0 : 1.1;
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
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#06070A]/90 backdrop-blur-xl transition-all font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full border ${t.primaryBorder30} flex items-center justify-center ${t.primaryBg10} overflow-hidden shadow-lg`}>
            <img src={`/brand/${activeMode}.png`} alt={t.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'; }} />
          </div>
          <div>
            <h2 className="text-sm font-serif font-black tracking-widest text-[#F7EFE7] uppercase">{t.title} <span className={t.primaryClass}>Voz</span></h2>
            <p className="text-[9px] font-mono tracking-widest uppercase text-[#A89F96]">{t.subtitle}</p>
          </div>
        </div>
        
        {/* Mode Switcher Tabs */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-[#10131A] p-1 rounded-full border border-[#252936]">
          <button
            onClick={() => setActiveMode('kaline')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
              activeMode === 'kaline' ? 'bg-[#252936] text-[#F7EFE7]' : 'text-[#A89F96] hover:text-[#F7EFE7]'
            }`}
          >
            Kaline
          </button>
          <button
            onClick={() => setActiveMode('klio')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
              activeMode === 'klio' ? 'bg-[#252936] text-[#F7EFE7]' : 'text-[#A89F96] hover:text-[#F7EFE7]'
            }`}
          >
            Klio
          </button>
          <button
            onClick={() => setActiveMode('kharis')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
              activeMode === 'kharis' ? 'bg-[#252936] text-[#F7EFE7]' : 'text-[#A89F96] hover:text-[#F7EFE7]'
            }`}
          >
            Kháris
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-[#A89F96] hover:text-[#F7EFE7] hover:bg-[#252936] rounded-xl transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-[#A89F96] hover:text-[#F7EFE7] hover:bg-[#252936] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Interaction Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        
        {/* Status Text */}
        <div className="h-8 flex items-center justify-center">
          <p className={`text-xs font-mono uppercase tracking-widest ${cfg.color} transition-colors duration-300`}>
            {cfg.text}
          </p>
        </div>

        {/* Central Orb / Button */}
        <div className="relative flex items-center justify-center w-48 h-48">
          {/* Animated rings based on state */}
          {currentState === 'recording' && (
            <>
              <div className={`absolute inset-0 rounded-full border ${t.primaryBorder30} animate-ping`} style={{ animationDuration: '2s' }}></div>
              <div className={`absolute inset-4 rounded-full border ${t.primaryBorder20} animate-ping`} style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
            </>
          )}

          {currentState === 'speaking' && (
            <div className="absolute inset-0 flex items-center justify-center gap-2">
              <div className={`w-1 h-12 ${t.primaryBgClass} rounded-full animate-pulse`}></div>
              <div className={`w-1 h-20 ${t.primaryBgClass} rounded-full animate-pulse`} style={{ animationDelay: '0.1s' }}></div>
              <div className={`w-1 h-16 ${t.primaryBgClass} rounded-full animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
              <div className={`w-1 h-24 ${t.primaryBgClass} rounded-full animate-pulse`} style={{ animationDelay: '0.3s' }}></div>
              <div className={`w-1 h-12 ${t.primaryBgClass} rounded-full animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}

          {/* Core Button */}
          <button 
            onClick={handleMainClick}
            className={`relative z-10 w-24 h-24 rounded-full border flex items-center justify-center shadow-2xl transition-all duration-500 
              ${cfg.bg} ${cfg.border} ${currentState === 'speaking' ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}
            `}
          >
            <cfg.icon className={`w-8 h-8 ${cfg.color}`} />
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className={`w-12 h-12 rounded-2xl border border-[#252936] bg-[#10131A] flex items-center justify-center text-[#A89F96] hover:text-[#F7EFE7] hover:${t.primaryBorder50} transition-all`}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`w-12 h-12 rounded-2xl border border-[#252936] bg-[#10131A] flex items-center justify-center text-[#A89F96] hover:text-[#F7EFE7] hover:${t.primaryBorder50} transition-all`}
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        {/* Histórico de Fala */}
        {messages.length > 0 && (
          <div className="w-full max-w-sm mt-4 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#A89F96] mb-2 px-1">Histórico de Fala</h3>
            {messages.slice(-5).map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl bg-[#10131A] border border-[#252936] text-xs text-[#A89F96]">
                <button 
                  onClick={() => replayMessage(m.text)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center bg-[#252936] hover:${t.primaryClass} transition-colors shrink-0`}
                  title="Ouvir novamente"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <div className="flex-1 truncate">
                  <span className="font-bold text-[#F7EFE7] mr-2">
                    {m.sender === 'me' ? 'Você:' : `${t.title}:`}
                  </span>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*,.pdf,.txt,.docx" 
      />

      {/* Chat Drawer Overlay */}
      {isDrawerOpen && (
        <div className="absolute inset-x-0 bottom-0 h-[60vh] bg-[#0B0D12] border-t border-[#252936] rounded-t-[32px] flex flex-col shadow-2xl z-[110] animate-in slide-in-from-bottom-full duration-300">
          <div className="flex items-center justify-between p-6 border-b border-[#252936]">
            <h3 className="text-sm font-bold text-[#F7EFE7] font-serif">Transcrição & Chat</h3>
            <button onClick={() => setIsDrawerOpen(false)} className="text-[#A89F96] hover:text-[#F7EFE7]">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={historyRef}>
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[10px] uppercase tracking-widest font-mono text-[#A89F96]/50">
                Sem mensagens ainda
              </div>
            ) : (
              messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                    m.sender === 'me' 
                      ? 'bg-[#252936] text-[#F7EFE7] rounded-br-sm' 
                      : `${t.primaryBg10} border ${t.primaryBorder20} ${t.primaryClass} rounded-bl-sm`
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 bg-[#10131A] border-t border-[#252936]">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSendText();
                }}
                placeholder="Digite algo..."
                className={`flex-1 bg-[#0B0D12] border border-[#252936] rounded-xl px-4 py-3 text-xs text-[#F7EFE7] focus:outline-none focus:${t.primaryBorder50}`}
              />
            </div>
          </div>
        </div>
      )}


      {/* Settings Drawer / Overlay */}
      {isSettingsOpen && (
        <div className="absolute inset-0 bg-[#06070A]/80 z-[120] flex flex-col justify-end animate-in fade-in duration-300">
          <div className="bg-[#10131A] border-t border-[#252936] rounded-t-[32px] p-6 pb-10 flex flex-col gap-6 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F7EFE7] font-serif">Configurações de Voz</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-[#A89F96] hover:text-[#F7EFE7]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-xs text-[#A89F96] uppercase tracking-widest font-bold">Estilo da Voz</p>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setVoiceStyle('direta')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                    voiceStyle === 'direta' 
                      ? `${t.primaryBg10} ${t.primaryBorder50} ${t.primaryClass}` 
                      : 'border-[#252936] bg-[#0B0D12] text-[#A89F96] hover:border-[#A89F96]/30'
                  }`}
                >
                  <span className="text-sm font-bold">Direta</span>
                  <span className="text-[10px] opacity-70 text-center">Foco e objetividade</span>
                </button>
                
                <button
                  onClick={() => setVoiceStyle('calorosa')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                    voiceStyle === 'calorosa' 
                      ? `${t.primaryBg10} ${t.primaryBorder50} ${t.primaryClass}` 
                      : 'border-[#252936] bg-[#0B0D12] text-[#A89F96] hover:border-[#A89F96]/30'
                  }`}
                >
                  <span className="text-sm font-bold">Calorosa</span>
                  <span className="text-[10px] opacity-70 text-center">Acolhimento e calma</span>
                </button>
                
                <button
                  onClick={() => setVoiceStyle('formal')}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all ${
                    voiceStyle === 'formal' 
                      ? `${t.primaryBg10} ${t.primaryBorder50} ${t.primaryClass}` 
                      : 'border-[#252936] bg-[#0B0D12] text-[#A89F96] hover:border-[#A89F96]/30'
                  }`}
                >
                  <span className="text-sm font-bold">Formal</span>
                  <span className="text-[10px] opacity-70 text-center">Seriedade e precisão</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-[#0B0D12] border border-[#252936]">
              <p className="text-xs text-[#A89F96] leading-relaxed">
                As configurações de voz usam a API local e alteram o tom e a velocidade (pitch/rate) da síntese para refletir o estilo escolhido, mantendo a voz principal da faceta atual.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

