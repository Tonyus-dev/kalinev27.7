import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Square, FileText, CheckCircle2, Clock, AlertCircle, RefreshCw, 
  ChevronRight, Download, Eye, Plus, Send, Play, BarChart2, MessageSquare, 
  Settings, Check, ChevronDown, List, Shield, ArrowRight, Save
} from 'lucide-react';

type SessionMode = 'audio' | 'text';
type BlockStatus = 'queued' | 'processing' | 'transcribed' | 'failed' | 'current';

interface Block {
  id: string;
  order: number;
  startTime: string; // MM:SS
  endTime: string; // MM:SS
  status: BlockStatus;
  transcription?: string;
  error?: string;
}

interface EcoSession {
  id: string;
  title: string;
  mode: SessionMode;
  date: string;
  blocks: Block[];
  isAnalyzed: boolean;
  status: 'nova' | 'gravando' | 'finalizando' | 'transcrevendo' | 'finalizada' | 'analisando' | 'analisada' | 'erro';
}

export function CavernaEcoPanel() {
  const [currentView, setCurrentView] = useState<'home' | 'audio-record' | 'text-input' | 'analysis'>('home');
  const [sessions, setSessions] = useState<EcoSession[]>([
    {
      id: 'sess-1',
      title: 'Planejamento Pritaneu',
      mode: 'audio',
      date: 'Hoje, 10:45',
      blocks: [],
      isAnalyzed: true,
      status: 'analisada'
    }
  ]);
  
  const [activeSession, setActiveSession] = useState<EcoSession | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textTitle, setTextTitle] = useState('');

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && recordingTime > 0 && recordingTime % 15 === 0) {
      if (activeSession) {
        const newBlockIndex = activeSession.blocks.length + 1;
        const newBlock: Block = {
          id: `b-${Date.now()}`,
          order: newBlockIndex,
          startTime: formatTime(recordingTime - 15),
          endTime: formatTime(recordingTime),
          status: 'transcribed',
          transcription: 'Trecho de áudio registrado. Transcrição online indisponível neste ambiente.'
        };
        
        const currentBlock: Block = {
          id: `b-${Date.now()}-curr`,
          order: newBlockIndex + 1,
          startTime: formatTime(recordingTime),
          endTime: '...',
          status: 'current'
        };

        const updatedBlocks = [...activeSession.blocks.filter(b => b.status !== 'current'), newBlock, currentBlock];
        setActiveSession({ ...activeSession, blocks: updatedBlocks });
      }
    }
  }, [recordingTime, isRecording]);


  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatLongTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const startAudioSession = async () => {
    const newSession: EcoSession = {
      id: `sess-${Date.now()}`,
      title: 'Nova Sessão de Áudio',
      mode: 'audio',
      date: 'Agora',
      blocks: [
        { id: `b-0`, order: 1, startTime: '00:00', endTime: '...', status: 'current' }
      ],
      status: 'gravando',
      isAnalyzed: false
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

      mediaRecorder.start();
    } catch(e: any) {
      console.error('Falha ao iniciar microfone', e);
      setIsRecording(false);
      setCurrentView('sessions');
      setActiveSession(null);
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
          base64data = base64data.split(',')[1] || '';

          if (activeSession) {
            const transcription = "Transcrição online indisponível: IA não configurada neste ambiente.";

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

const analyzeSession = async () => {
    if (activeSession) {
      setActiveSession({ ...activeSession, status: 'analisando' });
      
      activeSession.blocks.push({
        id: 'analysis',
        order: 99,
        startTime: '0',
        endTime: '0',
        status: 'failed',
        error: 'Análise online indisponível: IA não configurada neste ambiente.',
      });

      setActiveSession({ ...activeSession, status: 'analisada', isAnalyzed: true });
      setCurrentView('analysis');
    }
  };

  const renderHome = () => (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-serif font-black tracking-tight text-[#F7EFE7]">Caverna do Eco</h1>
        <p className="text-[#A89F96] text-sm">Câmara interna de escuta da Kaline</p>
      </div>

      <div className="bg-[#0B0D12] border border-[#252936] rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4C1F]/10 via-[#FF4C1F] to-[#FF4C1F]/10"></div>
        
        <div className="space-y-1">
          <p className="text-lg font-medium text-[#F7EFE7]">Fale sem organizar.</p>
          <p className="text-sm text-[#A89F96]">A Kaline organiza depois.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            onClick={startAudioSession}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#11131A] border border-[#FF4C1F]/30 hover:border-[#FF4C1F] hover:shadow-[0_0_20px_rgba(255,76,31,0.15)] transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#FF4C1F]/10 text-[#FF4C1F] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-[#F7EFE7]">Nova sessão de áudio</span>
          </button>

          <button 
            onClick={() => setCurrentView('text-input')}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#11131A] border border-[#252936] hover:border-[#A89F96] hover:bg-[#1A1D24] transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#252936] text-[#A89F96] flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-[#F7EFE7]">Câmara rápida em texto</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#A89F96] pl-2 border-b border-[#252936]/50 pb-2">Sessões recentes</h3>
        <div className="grid grid-cols-1 gap-3">
          {sessions.map(s => (
            <button 
              key={s.id}
              onClick={() => {
                setActiveSession(s);
                setCurrentView(s.isAnalyzed ? 'analysis' : 'audio-record');
              }}
              className="flex items-center justify-between p-4 rounded-xl bg-[#0B0D12] border border-[#252936] hover:border-[#FF4C1F]/50 transition-all text-left"
            >
              <div className="space-y-1">
                <span className="font-bold text-sm text-[#F7EFE7]">{s.title}</span>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#A89F96]">
                  <span className="flex items-center gap-1">
                    {s.mode === 'audio' ? <Mic className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                    {s.mode}
                  </span>
                  <span>·</span>
                  <span>{s.blocks.length} blocos</span>
                  <span>·</span>
                  <span className={s.isAnalyzed ? "text-[#22C55E]" : "text-[#D4AF37]"}>{s.isAnalyzed ? 'analisado' : 'pendente'}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#A89F96]" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecording = () => {
    if (!activeSession) return null;

    return (
      <div className="flex flex-col lg:flex-row gap-6 h-full animate-fade-in max-w-5xl mx-auto">
        {/* Left/Top: Recording Panel */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-[#0B0D12] border border-[#252936] rounded-3xl shadow-2xl relative min-h-[400px]">
          <div className="absolute top-6 left-6 space-y-1 text-left w-full">
            <h2 className="text-xl font-serif font-black text-[#F7EFE7]">Caverna do Eco</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-[#FF4C1F]">
              <span className="w-2 h-2 rounded-full bg-[#FF4C1F] animate-pulse"></span>
              {activeSession.status === 'gravando' ? 'áudio · gravando' : 'áudio · finalizada'}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 w-full gap-8 mt-12">
            <div className={`echo-orb flex items-center justify-center relative ${isRecording ? 'recording' : ''}`}>
              {isRecording ? (
                <div className="w-8 h-8 rounded-full bg-[#FF4C1F] animate-pulse shadow-[0_0_15px_#FF4C1F]" />
              ) : (
                <Mic className="w-10 h-10 text-[#FF4C1F]/50" />
              )}
            </div>
            
            <div className="text-5xl font-mono font-light text-[#F7EFE7] tracking-wider">
              {formatLongTime(recordingTime)}
            </div>

            <p className="text-xs text-[#A89F96] text-center max-w-[200px]">
              {isRecording ? 'Gravando em blocos de 3 minutos. Você pode parar quando quiser.' : 'Sessão salva. Aguardando blocos pendentes terminarem.'}
            </p>
          </div>

          <div className="mt-8 w-full">
            {isRecording ? (
              <button 
                onClick={stopAudioSession}
                className="w-full py-4 bg-[#FF4C1F] hover:bg-[#FF7A3D] text-[#050609] rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-current" /> Parar e finalizar
              </button>
            ) : (
              <button 
                onClick={analyzeSession}
                disabled={activeSession.status === 'analisando'}
                className="w-full py-4 bg-[#10131A] text-[#F7EFE7] border border-[#FF4C1F]/50 hover:bg-[#FF4C1F]/10 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {activeSession.status === 'analisando' ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FF4C1F]" />
                ) : (
                  <BarChart2 className="w-4 h-4 text-[#FF4C1F]" /> 
                )}
                {activeSession.status === 'analisando' ? 'Analisando eco...' : 'Analisar eco'}
              </button>
            )}
          </div>
        </div>

        {/* Right/Bottom: Blocks Panel */}
        <div className="w-full lg:w-1/2 flex flex-col bg-[#11131A] border border-[#252936] rounded-3xl p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#A89F96] pb-4 mb-2 border-b border-[#252936]/50">
            Blocos de 3 minutos
          </h3>
          
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
            {activeSession.blocks.map((block) => (
              <div key={block.id} className="p-4 rounded-xl bg-[#0B0D12] border border-[#252936] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#F7EFE7]">Bloco {block.order.toString().padStart(2, '0')}</span>
                    <span className="text-[10px] font-mono text-[#A89F96]">{block.startTime}–{block.endTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                    {block.status === 'current' && <span className="text-[#FF4C1F] flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#FF4C1F] animate-pulse"></div>gravando agora</span>}
                    {block.status === 'processing' && <span className="text-[#D4AF37] flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" />processando</span>}
                    {block.status === 'transcribed' && <span className="text-[#22C55E] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" />transcrito</span>}
                    {block.status === 'failed' && <span className="text-[#EF4444] flex items-center gap-1"><AlertCircle className="w-3 h-3" />falhou</span>}
                  </div>
                </div>
                {block.transcription && (
                  <p className="text-xs text-[#A89F96] leading-relaxed border-t border-[#252936]/50 pt-2 mt-1">
                    “{block.transcription}”
                  </p>
                )}
              </div>
            ))}
            {activeSession.blocks.length === 0 && (
              <div className="h-32 flex items-center justify-center text-xs text-[#A89F96] italic">
                Nenhum bloco gerado ainda.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTextInput = () => (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-1 mb-8">
        <button onClick={() => setCurrentView('home')} className="text-xs text-[#A89F96] hover:text-[#F7EFE7] flex items-center gap-1 mb-4">
          ← Voltar
        </button>
        <h2 className="text-2xl font-serif font-black text-[#F7EFE7]">Câmara rápida em texto</h2>
        <p className="text-xs text-[#A89F96]">
          Cole uma conversa, reunião, anotação ou despejo bruto.<br/>
          A Kaline vai devolver estrutura sem transformar isso em memória automaticamente.
        </p>
      </div>

      <div className="space-y-4 bg-[#0B0D12] border border-[#252936] rounded-3xl p-6 shadow-xl">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-[#A89F96] pl-1">Título</label>
          <input 
            type="text"
            value={textTitle}
            onChange={e => setTextTitle(e.target.value)}
            placeholder="Ex: Reunião de Alinhamento"
            className="w-full bg-[#11131A] border border-[#252936] rounded-xl px-4 py-3 text-sm text-[#F7EFE7] focus:outline-none focus:border-[#FF4C1F] transition-colors"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-wider text-[#A89F96] pl-1">Conteúdo</label>
          <textarea 
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Cole o despejo bruto aqui..."
            className="w-full bg-[#11131A] border border-[#252936] rounded-xl px-4 py-3 text-sm text-[#F7EFE7] focus:outline-none focus:border-[#FF4C1F] transition-colors h-64 resize-none"
          />
        </div>

        <button 
          onClick={() => {
            const newSession: EcoSession = {
              id: `sess-${Date.now()}`,
              title: textTitle || 'Sessão de Texto',
              mode: 'text',
              date: 'Agora',
              blocks: [],
              isAnalyzed: true,
              status: 'analisada'
            };
            setSessions([newSession, ...sessions]);
            setActiveSession(newSession);
            setCurrentView('analysis');
          }}
          disabled={!textInput.trim()}
          className="w-full py-4 bg-[#FF4C1F] hover:bg-[#FF7A3D] disabled:opacity-50 disabled:hover:bg-[#FF4C1F] text-[#050609] rounded-xl font-black text-sm uppercase tracking-wider transition-all"
        >
          Criar sessão de texto
        </button>
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!activeSession) return null;

    return (
      <div className="flex flex-col lg:flex-row gap-6 animate-fade-in max-w-6xl mx-auto pb-10">
        {/* Left: Metadata & Context */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="bg-[#0B0D12] border border-[#252936] rounded-3xl p-6 shadow-xl space-y-4">
            <button onClick={() => setCurrentView('home')} className="text-xs text-[#A89F96] hover:text-[#F7EFE7] flex items-center gap-1 mb-2">
              ← Sair da análise
            </button>
            <h2 className="text-xl font-serif font-black text-[#F7EFE7] leading-tight">{activeSession.title}</h2>
            <div className="flex items-center gap-3 text-[11px] font-mono text-[#A89F96] border-b border-[#252936]/50 pb-4">
              <span>{activeSession.mode === 'audio' ? 'Áudio' : 'Texto'}</span>
              <span>·</span>
              <span>{activeSession.date}</span>
            </div>
            <p className="text-xs text-[#A89F96] italic">
              A análise não vira memória sozinha.<br/>
              Revise antes de plantar.
            </p>
          </div>

          <div className="bg-[#11131A] border border-[#252936] rounded-3xl p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A89F96] mb-4">Interlocutores</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-[#F7EFE7]"><span className="w-1.5 h-1.5 rounded-full bg-[#FF4C1F]"></span> voz principal · <span className="text-[#A89F96]">provável</span></li>
              <li className="flex items-center gap-2 text-[#F7EFE7]"><span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]"></span> pessoa citada · <span className="text-[#A89F96]">hipotético</span></li>
            </ul>
          </div>

          <div className="bg-[#11131A] border border-[#252936] rounded-3xl p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A89F96] mb-4">Ata & Infográfico</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0D12] border border-[#252936]">
                <span className="text-xs font-bold text-[#F7EFE7] flex items-center gap-2"><FileText className="w-3.5 h-3.5 text-[#A89F96]" /> Ata estruturada</span>
                <div className="flex gap-2">
                  <button className="text-[#A89F96] hover:text-[#FF4C1F]"><Eye className="w-4 h-4" /></button>
                  <button className="text-[#A89F96] hover:text-[#FF4C1F]"><Download className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0D12] border border-[#252936]">
                <span className="text-xs font-bold text-[#F7EFE7] flex items-center gap-2"><BarChart2 className="w-3.5 h-3.5 text-[#A89F96]" /> Infográfico SVG</span>
                <div className="flex gap-2">
                  <button className="text-[#A89F96] hover:text-[#FF4C1F]"><Eye className="w-4 h-4" /></button>
                  <button className="text-[#A89F96] hover:text-[#FF4C1F]"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Analysis Results */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Resumo Operacional */}
          <div className="bg-[#0B0D12] border border-[#FF4C1F]/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FF4C1F]"></div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FF4C1F] mb-3">Resumo operacional</h3>
            <p className="text-sm text-[#F7EFE7] leading-relaxed">
              Sessão de alinhamento focada na reestruturação da Caverna do Eco e do ecossistema Kaline Totalidade. 
              Ficou definido que a interface deve atuar como uma escuta profunda, sem automatizar a criação de memórias.
              A regra dos blocos de 3 minutos será preservada visualmente.
            </p>
          </div>

          {/* Temas */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#A89F96] pl-1">Temas</h3>
            <div className="flex flex-wrap gap-2">
              {['arquitetura', 'memória', 'UX', 'integração local'].map(t => (
                <span key={t} className="px-3 py-1.5 rounded-lg bg-[#11131A] border border-[#252936] text-[11px] font-mono text-[#F7EFE7]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Decisões */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#A89F96] pl-1">Decisões detectadas</h3>
            <div className="p-4 rounded-2xl bg-[#11131A] border border-[#252936] space-y-3">
              <p className="text-sm text-[#F7EFE7]">
                Possível decisão: manter Totalidade, Héstia e Hefaístia como repositórios separados.
              </p>
              <div className="flex gap-3">
                <button className="text-[10px] font-bold uppercase tracking-wider text-[#FF4C1F] hover:text-[#FF7A3D] flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Enviar para revisão
                </button>
                <button className="text-[10px] font-bold uppercase tracking-wider text-[#A89F96] hover:text-[#F7EFE7] flex items-center gap-1">
                  Copiar
                </button>
              </div>
            </div>
          </div>

          {/* Sinais */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#A89F96] pl-1">Sinais</h3>
            <div className="p-4 rounded-2xl bg-[#11131A] border border-[#252936] space-y-3 border-l-2 border-l-[#EF4444]">
              <p className="text-sm text-[#F7EFE7]">
                <strong className="text-[#EF4444]">Risco:</strong> risco de criar dashboard falso em vez de controle operacional real.
              </p>
              <button className="text-[10px] font-bold uppercase tracking-wider text-[#FF4C1F] hover:text-[#FF7A3D] flex items-center gap-1">
                 Semear hipótese
              </button>
            </div>
          </div>

          {/* Próximos gestos */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#A89F96] pl-1">Próximos gestos sugeridos</h3>
            <div className="p-4 rounded-2xl bg-[#11131A] border border-[#252936] space-y-3 border-l-2 border-l-[#38BDF8]">
              <p className="text-sm text-[#F7EFE7]">
                Criar rota /station como leitura read-only.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="text-[10px] font-bold uppercase tracking-wider text-[#A89F96] hover:text-[#F7EFE7]">Copiar</button>
                <button className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] hover:text-[#7DD3FC]">Criar retorno Kairós</button>
                <button className="text-[10px] font-bold uppercase tracking-wider text-[#FF4C1F] hover:text-[#FF7A3D]">Enviar para revisão</button>
              </div>
            </div>
          </div>

          {/* Candidatos de Revisão */}
          <div className="space-y-3 pt-4 border-t border-[#252936]/50">
            <div className="flex justify-between items-end">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#A89F96] pl-1">Candidatos de revisão</h3>
              <span className="text-[9px] text-[#A89F96] italic max-w-[200px] text-right leading-tight">Trechos que podem virar memória, mas ainda precisam de confirmação.</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#11131A] border border-[#252936] space-y-3">
              <p className="text-sm text-[#F7EFE7] italic text-[#A89F96]">
                "Nós precisamos garantir que o usuário saiba que nada daqui vai direto pro banco sem passar pela revisão dele."
              </p>
              <div className="flex gap-3 pt-2">
                <button className="text-[10px] font-bold uppercase tracking-wider bg-[#252936] text-[#F7EFE7] px-3 py-1.5 rounded-md hover:bg-[#323748] transition-colors">
                  Enviar hipótese para revisão
                </button>
                <button className="text-[10px] font-bold uppercase tracking-wider text-[#A89F96] hover:text-[#EF4444] px-2 py-1.5">
                  Ignorar
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-full pb-10">
      <style>{`
        .echo-orb {
          width: 180px;
          height: 180px;
          border-radius: 999px;
          border: 1px solid rgba(255, 76, 31, 0.45);
          background: radial-gradient(circle, rgba(255, 76, 31, 0.22), transparent 58%), #0B0D12;
          box-shadow: 0 0 24px rgba(255, 76, 31, 0.35), 0 0 80px rgba(255, 76, 31, 0.16);
        }
        
        @media (prefers-reduced-motion: no-preference) {
          .echo-orb.recording {
            animation: echoPulse 1.8s ease-in-out infinite;
          }
        }

        @keyframes echoPulse {
          0%, 100% {
            transform: scale(1);
            opacity: .9;
          }
          50% {
            transform: scale(1.035);
            opacity: 1;
          }
        }
      `}</style>
      
      {currentView === 'home' && renderHome()}
      {currentView === 'audio-record' && renderRecording()}
      {currentView === 'text-input' && renderTextInput()}
      {currentView === 'analysis' && renderAnalysis()}
      
    </div>
  );
}
