import React, { useState } from 'react';
import { Shield, Sparkles, User, RefreshCw, Layers, Sliders, Volume2, Mic, Save, Trash2, Settings, ArrowLeft, Users, Mail, MessageSquare, Database, Activity, UserPlus, Check } from 'lucide-react';

export default function GuardiaoPanel() {
  const [chatModel, setChatModel] = useState('google/gemini-2.5-flash-lite');
  const [ttsModel, setTtsModel] = useState('google/gemini-3.1-flash-tts-preview');
  const [ttsVoice, setTtsVoice] = useState('Vindemiatrix (gentil)');
  const [sttModel, setSttModel] = useState('google/gemini-2.5-flash-lite');
  const [sttFallback, setSttFallback] = useState('openai/whisper-large-v3');

  const [activeDialogueFacet, setActiveDialogueFacet] = useState(() => {
    const saved = localStorage.getItem('kaline_active_dialogue_facet');
    if (saved === 'kuan' || saved === 'kuanyin' || saved === 'kuan-yin') localStorage.setItem('kaline_active_dialogue_facet', 'kaline');
    return saved === 'kharis' ? saved : 'kaline';
  });

  const [promptCaching, setPromptCaching] = useState(() => localStorage.getItem('kaline_prompt_caching') !== 'false');
  const [semanticCaching, setSemanticCaching] = useState(() => localStorage.getItem('kaline_semantic_caching') === 'true');

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'protegido' | 'guardiao'>('protegido');
  const [selectedModules, setSelectedModules] = useState<string[]>(['chat']);

  const toggleModule = (id: string) => {
    setSelectedModules(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const modules = [
    { id: 'chat', name: 'Chat (Kaline)', desc: 'Ler e enviar mensagens na conversa com Kaline.' },
    { id: 'kharis', name: 'Kháris', desc: 'Acessar a faceta Kháris, de cuidado neurodivergente, no chat.' },
    { id: 'agenda', name: 'Agenda', desc: 'Ver e criar eventos e lembretes do calendário.' },
    { id: 'treinos', name: 'Treinos', desc: 'Acompanhar e registrar treinos, séries, PRs e sinais do corpo.' },
    { id: 'livros', name: 'Livros & Resumos', desc: 'Acessar a biblioteca, resumos e infográficos.' },
    { id: 'eco', name: 'Câmara de Eco', desc: 'Subir áudios, conversas e atas para eco e transcrição.' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10" id="panel-guardiao-root">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <ArrowLeft className="w-4 h-4 text-[#A89F96]" />
        <div>
          <h2 className="text-lg font-black text-[#F7EFE7] font-serif tracking-widest uppercase">Guardião</h2>
          <p className="text-[10px] text-[#A89F96] tracking-widest uppercase font-bold">Operação da IA - Modelos - Acesso</p>
        </div>
      </div>

      {/* Resumo do Workspace */}
      <div className="space-y-2">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-[#A89F96]">Resumo do Workspace</h3>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          <div className="bg-[#0B0D12] border border-[#252936] rounded-xl p-3 min-w-[130px] shrink-0">
            <div className="flex items-center gap-1.5 text-[9px] text-[#A89F96] uppercase tracking-wider font-bold mb-2">
              <Users className="w-3 h-3" /> Perfis Ativos
            </div>
            <div className="text-2xl font-serif text-[#F7EFE7]">0</div>
          </div>
          <div className="bg-[#0B0D12] border border-[#252936] rounded-xl p-3 min-w-[140px] shrink-0">
            <div className="flex items-center gap-1.5 text-[9px] text-[#A89F96] uppercase tracking-wider font-bold mb-2">
              <Mail className="w-3 h-3" /> Convites Pendentes
            </div>
            <div className="text-2xl font-serif text-[#F7EFE7]">0</div>
          </div>
          <div className="bg-[#0B0D12] border border-[#252936] rounded-xl p-3 min-w-[130px] shrink-0">
            <div className="flex items-center gap-1.5 text-[9px] text-[#A89F96] uppercase tracking-wider font-bold mb-2">
              <MessageSquare className="w-3 h-3" /> Mensagens Hoje
            </div>
            <div className="text-2xl font-serif text-[#F7EFE7]">0</div>
          </div>
          <div className="bg-[#0B0D12] border border-[#252936] rounded-xl p-3 min-w-[140px] shrink-0">
            <div className="flex items-center gap-1.5 text-[9px] text-[#A89F96] uppercase tracking-wider font-bold mb-2">
              <MessageSquare className="w-3 h-3" /> Mensagens 7 Dias
            </div>
            <div className="text-2xl font-serif text-[#FF4C1F]">82</div>
          </div>
          <div className="bg-[#0B0D12] border border-[#252936] rounded-xl p-3 min-w-[140px] shrink-0">
            <div className="flex items-center gap-1.5 text-[9px] text-[#A89F96] uppercase tracking-wider font-bold mb-2">
              <Database className="w-3 h-3" /> Sem Contexto Ini...
            </div>
            <div className="text-2xl font-serif text-[#F7EFE7]">0</div>
          </div>
        </div>
      </div>

      {/* Modelos da Kaline */}
      <div className="bg-[#0B0D12] border border-[#252936] rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-xs font-black tracking-widest uppercase text-[#F7EFE7]">Modelos da Kaline</h3>
          <p className="text-[10px] text-[#A89F96] mt-0.5">Configuração operacional da IA controlada pelo Guardião.</p>
        </div>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">Chat - Modelo</label>
            <select 
              value={chatModel} onChange={(e) => setChatModel(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-lg focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7]"
            >
              <option value="google/gemini-2.5-flash-lite">google/gemini-2.5-flash-lite</option>
              <option value="google/gemini-1.5-pro">google/gemini-1.5-pro</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">TTS - Modelo</label>
            <select 
              value={ttsModel} onChange={(e) => setTtsModel(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-lg focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7]"
            >
              <option value="google/gemini-3.1-flash-tts-preview">google/gemini-3.1-flash-tts-preview</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">TTS - Voz</label>
            <select 
              value={ttsVoice} onChange={(e) => setTtsVoice(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-lg focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7]"
            >
              <option value="Vindemiatrix (gentil)">Vindemiatrix (gentil)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">STT - Modelo</label>
              <select 
                value={sttModel} onChange={(e) => setSttModel(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-lg focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7]"
              >
                <option value="google/gemini-2.5-flash-lite">google/gemini-2.5-flash-lite</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">STT - Fallback</label>
              <select 
                value={sttFallback} onChange={(e) => setSttFallback(e.target.value)}
                className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-lg focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7]"
              >
                <option value="openai/whisper-large-v3">openai/whisper-large-v3</option>
              </select>
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">Faceta Ativa para Diálogo (Configuração do Admin)</label>
            <select 
              value={activeDialogueFacet} 
              onChange={(e) => {
                setActiveDialogueFacet(e.target.value);
                localStorage.setItem('kaline_active_dialogue_facet', e.target.value);
                window.dispatchEvent(new CustomEvent('kalineActiveFacetChanged', { detail: e.target.value }));
              }}
              className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-lg focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7]"
            >
              <option value="kaline">Kaline (Naturalidade e Presença)</option>
              <option value="kharis">Kháris (Cuidado, Simplicidade e Gentileza)</option>
            </select>
            <p className="text-[8px] text-[#A89F96]">
              O administrador escolhe com qual faceta da Kaline os outros usuários podem conversar.
            </p>
          </div>

          <div className="pt-4 border-t border-[#252936] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#F7EFE7]">Prompt Caching</div>
                <div className="text-[9px] text-[#A89F96] mt-0.5">Mantém o sistema e as instruções em cache para baratear a API.</div>
              </div>
              <button 
                onClick={() => {
                  const val = !promptCaching;
                  setPromptCaching(val);
                  localStorage.setItem('kaline_prompt_caching', val ? 'true' : 'false');
                }}
                className={`w-10 h-5 rounded-full relative transition-colors ${promptCaching ? 'bg-[#FF4C1F]' : 'bg-[#252936]'}`}
              >
                <div className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white transition-all ${promptCaching ? 'left-[22px]' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#F7EFE7]">Semantic Caching</div>
                <div className="text-[9px] text-[#A89F96] mt-0.5">Conversa com a Sedimentação: recupera memórias similares sem gerar do zero.</div>
              </div>
              <button 
                onClick={() => {
                  const val = !semanticCaching;
                  setSemanticCaching(val);
                  localStorage.setItem('kaline_semantic_caching', val ? 'true' : 'false');
                }}
                className={`w-10 h-5 rounded-full relative transition-colors ${semanticCaching ? 'bg-[#FF4C1F]' : 'bg-[#252936]'}`}
              >
                <div className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white transition-all ${semanticCaching ? 'left-[22px]' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KITT DEBUG */}
      <div className="bg-[#0B0D12] border border-[#252936] rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-black tracking-widest uppercase text-[#F7EFE7]">KITT - Debug (Admin)</h3>
        
        <div className="bg-[#10131A] border border-[#252936] rounded-lg p-3">
          <div className="flex justify-between items-center text-[8px] font-mono font-bold text-[#A89F96] border-b border-[#252936] pb-2 mb-2">
            <span>KITT - DEBUG</span>
            <span>FINAL: <span className="text-[#F7EFE7]">IDLE</span> - PRIO 0</span>
          </div>
          
          <div className="space-y-2 text-[9px] font-mono text-[#8B837C]">
            <div className="flex justify-between items-center">
              <span>VOICE</span>
              <span>-</span>
            </div>
            <div className="flex justify-between items-center">
              <span>TTS</span>
              <span>-</span>
            </div>
            <div className="flex justify-between items-center">
              <span>RADAR</span>
              <span>-</span>
            </div>
            <div className="flex justify-between items-center">
              <span>CHAT</span>
              <span>-</span>
            </div>
            <div className="flex justify-between items-center">
              <span>SYSTEM</span>
              <span>-</span>
            </div>
          </div>
        </div>
      </div>

      {/* Convidar novo perfil */}
      <div className="bg-[#0B0D12] border border-[#252936] rounded-2xl p-5 space-y-5">
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-[#F7EFE7]" />
          <h3 className="text-sm font-black text-[#F7EFE7] font-serif">Convidar novo perfil</h3>
        </div>
        <p className="text-[10px] text-[#A89F96]">
          Defina o tipo de perfil. O convidado recebe um e-mail, cria a conta dele e passa a ver no app só os módulos que você marcar. O Guardião tem acesso ao histórico do Protegido.
        </p>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">Tipo de Perfil</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setInviteRole('protegido')}
                className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${inviteRole === 'protegido' ? 'bg-[#FF4C1F]/10 border-[#FF4C1F] text-[#F7EFE7]' : 'bg-[#10131A] border-[#252936] text-[#A89F96]'}`}
              >
                <div>
                  <div className="text-xs font-bold">Protegido</div>
                  <div className="text-[9px] mt-0.5 opacity-80">Monitorado, filho adolescente</div>
                </div>
                {inviteRole === 'protegido' && <Check className="w-4 h-4 text-[#FF4C1F]" />}
              </button>
              <button 
                onClick={() => setInviteRole('guardiao')}
                className={`p-3 rounded-lg border text-left transition-colors flex items-center justify-between ${inviteRole === 'guardiao' ? 'bg-[#FF4C1F]/10 border-[#FF4C1F] text-[#F7EFE7]' : 'bg-[#10131A] border-[#252936] text-[#A89F96]'}`}
              >
                <div>
                  <div className="text-xs font-bold">Guardião</div>
                  <div className="text-[9px] mt-0.5 opacity-80">Administrador completo</div>
                </div>
                {inviteRole === 'guardiao' && <Check className="w-4 h-4 text-[#FF4C1F]" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">E-mail</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="pessoa@exemplo.com"
              className="w-full text-xs px-3 py-2.5 bg-[#10131A] border border-[#252936] rounded-lg focus:outline-none focus:border-[#FF4C1F] text-[#F7EFE7]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-wider text-[#A89F96]">Módulos Liberados</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {modules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className={`p-3 rounded-lg border text-left transition-colors ${selectedModules.includes(mod.id) ? 'bg-[#10131A] border-[#FF4C1F]/50 text-[#F7EFE7]' : 'bg-[#0B0D12] border-[#252936] text-[#A89F96]'}`}
                >
                  <div className="text-xs font-bold mb-1 flex justify-between items-center">
                    {mod.name}
                    {selectedModules.includes(mod.id) && <Check className="w-3.5 h-3.5 text-[#FF4C1F]" />}
                  </div>
                  <div className="text-[9px] opacity-70 leading-tight">{mod.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button className="px-4 py-2 bg-[#FF4C1F]/20 text-[#FF4C1F] hover:bg-[#FF4C1F]/30 border border-[#FF4C1F]/30 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
            <Mail className="w-3.5 h-3.5" /> Enviar convite
          </button>
        </div>
      </div>

      {/* Perfis Ativos & Convites */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-[10px] font-black tracking-widest uppercase text-[#A89F96] flex items-center gap-1.5">
            <Users className="w-3 h-3" /> Perfis Ativos
          </h3>
          <p className="text-[10px] text-[#A89F96] font-mono italic">
            Ninguém ainda. Use o formulário acima para convidar.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-[10px] font-black tracking-widest uppercase text-[#A89F96] flex items-center gap-1.5">
            <Mail className="w-3 h-3" /> Convites
          </h3>
          <p className="text-[10px] text-[#A89F96] font-mono italic">
            Sem convites.
          </p>
        </div>
      </div>

    </div>
  );
}
