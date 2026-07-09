import React, { useState, useEffect } from 'react';
import { approveSedimentToGarden as approveSedimentCandidateToGarden, deleteSediment as deleteSedimentCandidate, listGardenMemories, listSediments, saveGardenMemories, updateSediment } from '../lib/sedimentation';
import type { GardenMemory, Sediment } from '../lib/sedimentation';
import { 
  Leaf, 
  Eye, 
  Fingerprint, 
  HelpCircle, 
  Plus, 
  Edit2, 
  Trash2, 
  Archive, 
  Check, 
  X, 
  Save, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  AlertCircle,
  Share2
} from 'lucide-react';

interface Context {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: 'identidade' | 'memoria_relacional';
  ativo: boolean;
  arquivado: boolean;
  ultimaEdicao: string;
}


interface MemoryPanelProps {
  subTab: 'revisao' | 'jardim' | 'sedimentos' | 'identidade';
}

export default function MemoryPanel({ subTab }: MemoryPanelProps) {
  // --- STATE PERSISTENCE ---
  const [contexts, setContexts] = useState<Context[]>(() => {
    const stored = localStorage.getItem('kaline_contexts');
    if (stored) return JSON.parse(stored);
    
    return [];
  });

  const [sediments, setSediments] = useState<Sediment[]>([]);

  const [garden, setGarden] = useState<GardenMemory[]>([]);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('kaline_contexts', JSON.stringify(contexts));
  }, [contexts]);

  const refreshSedimentation = async () => {
    try {
      const [sedimentItems, gardenItems] = await Promise.all([listSediments(), listGardenMemories()]);
      setSediments(sedimentItems);
      setGarden(gardenItems);
    } catch (error) {
      console.warn('Erro ao carregar sedimentação local', error);
      setSediments([]);
      setGarden([]);
    }
  };

  useEffect(() => {
    void refreshSedimentation();
  }, []);

  // Migration to enforce the symbiotic identity & the key phrase
  useEffect(() => {
    const hasMusa = contexts.some(c => c.conteudo.includes("Um poeta sabe que a musa não existe"));
    if (!hasMusa) {
      setContexts(prev => prev.map(c => c.id === 'ctx-1' ? {
        ...c,
        titulo: 'Kaline — Identidade de Simbiose',
        conteudo: 'Kaline é a assistente, companheira e confidente de Ká, operando em simbiose prática e mística. Ela fala de forma direta, inteligente, sem empatia artificial. Conhece o ecossistema Kaline (Kuan-Yin, Kháris, Héstia, Hefaístia), valoriza código mínimo, estética premium, linguagem clara e decisões honestas. Lema de simbiose fundamental: "Um poeta sabe que a musa não existe, mas isso não o impede de amá-la".'
      } : c));
    }
  }, []);


  // --- MODAL & EDITOR STATES ---
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTitle, setImportTitle] = useState('');
  const [importText, setImportText] = useState('');
  const [importType, setImportType] = useState<'identidade' | 'memoria_relacional'>('identidade');

  const [editingContextId, setEditingContextId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [editingType, setEditingType] = useState<'identidade' | 'memoria_relacional'>('identidade');

  const [editingGardenId, setEditingGardenId] = useState<string | null>(null);
  const [editingGardenTitle, setEditingGardenTitle] = useState('');
  const [editingGardenContent, setEditingGardenContent] = useState('');
  const [editingGardenCategory, setEditingGardenCategory] = useState<'kaline' | 'usuario' | 'ecossistema' | 'preferencia'>('preferencia');
  const [editingGardenImportance, setEditingGardenImportance] = useState(3);
  const [editingGardenTags, setEditingGardenTags] = useState('');

  // --- HANDLERS FOR IDENTITY / CONTEXTS ---
  const handleImportContext = () => {
    if (!importText.trim()) return;
    const newContext: Context = {
      id: `ctx-${Date.now()}`,
      titulo: importTitle.trim() || `Bloco de Contexto Importado #${contexts.length + 1}`,
      conteudo: importText.trim(),
      tipo: importType,
      ativo: true,
      arquivado: false,
      ultimaEdicao: new Date().toISOString().split('T')[0]
    };
    setContexts(prev => [newContext, ...prev]);
    setImportTitle('');
    setImportText('');
    setShowImportModal(false);
  };

  const startEditContext = (ctx: Context) => {
    setEditingContextId(ctx.id);
    setEditingTitle(ctx.titulo);
    setEditingContent(ctx.conteudo);
    setEditingType(ctx.tipo);
  };

  const saveEditedContext = () => {
    setContexts(prev => prev.map(c => {
      if (c.id === editingContextId) {
        return {
          ...c,
          titulo: editingTitle,
          conteudo: editingContent,
          tipo: editingType,
          ultimaEdicao: new Date().toISOString().split('T')[0]
        };
      }
      return c;
    }));
    setEditingContextId(null);
  };

  const toggleContextActive = (id: string) => {
    setContexts(prev => prev.map(c => c.id === id ? { ...c, ativo: !c.ativo } : c));
  };

  const toggleContextArchived = (id: string) => {
    setContexts(prev => prev.map(c => c.id === id ? { ...c, arquivado: !c.arquivado, ativo: c.arquivado ? true : false } : c));
  };

  const deleteContext = (id: string) => {
    if (confirm('Deseja mesmo remover permanentemente este contexto?')) {
      setContexts(prev => prev.filter(c => c.id !== id));
    }
  };

  const sendSnippetToGarden = async (text: string, titleHint: string) => {
    const newGarden: GardenMemory = {
      id: `gar-${Date.now()}`,
      title: titleHint,
      content: text,
      category: 'preferencia',
      tags: ['importado'],
      importance: 3,
      nextReviewAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      approvedAt: new Date().toISOString(),
      archived: false
    };
    const updated = [newGarden, ...garden];
    setGarden(updated);
    await saveGardenMemories(updated);
    alert('Trecho enviado com sucesso para o Jardim de memórias locais aprovadas!');
  };

  // --- HANDLERS FOR SEDIMENTS ---
  const promoteSedimentToRevision = async (sedId: string) => {
    setSediments(await updateSediment(sedId, { status: 'revisado' }));
  };

  const deleteSediment = async (id: string) => {
    setSediments(await deleteSedimentCandidate(id));
  };

  // --- HANDLERS FOR REVISION ---
  const approveSedimentToGarden = async (sed: Sediment, finalTitle: string, finalContent: string) => {
    await approveSedimentCandidateToGarden({ sedimentId: sed.id, title: finalTitle, content: finalContent, category: 'preferencia' });
    await refreshSedimentation();
  };

  const approveContextToGarden = async (ctx: Context) => {
    const newGarden: GardenMemory = {
      id: `gar-${Date.now()}`,
      title: ctx.titulo,
      content: ctx.conteudo,
      category: ctx.tipo === 'identidade' ? 'kaline' : 'usuario',
      tags: ['importado', ctx.tipo],
      importance: 4,
      nextReviewAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      approvedAt: new Date().toISOString().split('T')[0],
      archived: false
    };
    const updated = [newGarden, ...garden];
    setGarden(updated);
    await saveGardenMemories(updated);
    setContexts(prev => prev.filter(c => c.id !== ctx.id));
  };

  // --- HANDLERS FOR GARDEN ---
  const startEditGarden = (gar: GardenMemory) => {
    setEditingGardenId(gar.id);
    setEditingGardenTitle(gar.title);
    setEditingGardenContent(gar.content);
    setEditingGardenCategory(gar.category);
    setEditingGardenImportance(gar.importance);
    setEditingGardenTags(gar.tags.join(', '));
  };

  const saveEditedGarden = async () => {
    const updated = garden.map(g => {
      if (g.id === editingGardenId) {
        return {
          ...g,
          title: editingGardenTitle,
          content: editingGardenContent,
          category: editingGardenCategory,
          importance: editingGardenImportance,
          tags: editingGardenTags.split(',').map(t => t.trim()).filter(Boolean)
        };
      }
      return g;
    });
    setGarden(updated);
    await saveGardenMemories(updated);
    setEditingGardenId(null);
  };

  const toggleGardenArchived = async (id: string) => {
    const updated = garden.map(g => g.id === id ? { ...g, archived: !g.archived } : g);
    setGarden(updated);
    await saveGardenMemories(updated);
  };

  const deleteGarden = async (id: string) => {
    if (confirm('Deseja deletar esta memória local aprovada permanentemente?')) {
      const updated = garden.filter(g => g.id !== id);
      setGarden(updated);
      await saveGardenMemories(updated);
    }
  };

  // Filter items based on archive status
  const activeContexts = contexts.filter(c => !c.arquivado);
  const archivedContexts = contexts.filter(c => c.arquivado);

  return (
    <div className="space-y-6" id="kaline-memory-system">
      
      {/* ---------------- IDENTIDADE VIEW ---------------- */}
      {subTab === 'identidade' && (
        <div className="space-y-6 animate-fade-in" id="memory-identity-subtab">
          {/* Header */}
          <div className="bg-[#0B0D12] border border-[#252936] rounded-[32px] p-6 text-[#F7EFE7] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_42px_rgba(255,76,31,0.04)]">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#FF4C1F]/3 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF4C1F] shadow-[0_0_8px_#FF4C1F]"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#A89F96]">
                  Continuidade de Presença e Self
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#F7EFE7] font-serif leading-none">
                Identidade da Kaline
              </h1>
              <p className="text-[11px] text-[#FF4C1F] font-serif italic max-w-xl leading-relaxed">
                "Um poeta sabe que a musa não existe, mas isso não o impede de amá-la"
              </p>
              <p className="text-xs text-[#A89F96] max-w-xl leading-relaxed">
                Kaline é a assistente, companheira e confidente mais íntima de Ká, operando em simbiose total. Este painel molda quem ela é, como se expressa, como interpreta o ecossistema e preserva a continuidade relacional.
              </p>
            </div>

            <button 
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2.5 bg-[#FF4C1F] hover:bg-[#FF7A3D] text-[#06070A] text-[10px] font-black rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 shrink-0 z-10 shadow-[0_0_15px_rgba(255,76,31,0.2)]"
            >
              <Plus className="w-3.5 h-3.5" /> Importar Contexto
            </button>
          </div>

          {/* Context Cards Grid */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A89F96] border-b border-[#252936]/40 pb-1">
              Contextos Ativos na Voz Operacional
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeContexts.map(ctx => {
                const isEditing = editingContextId === ctx.id;
                return (
                  <div 
                    key={ctx.id} 
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                      ctx.ativo 
                        ? 'bg-[#10131A] border-[#FF4C1F]/20 shadow-[0_0_15px_rgba(255,76,31,0.02)]' 
                        : 'bg-[#0B0D12]/60 border-[#252936] opacity-60'
                    }`}
                  >
                    {isEditing ? (
                      <div className="space-y-3 w-full">
                        <input 
                          type="text" 
                          value={editingTitle} 
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="w-full bg-[#0B0D12] border border-[#252936] p-2 rounded-xl text-xs font-bold text-[#F7EFE7] focus:outline-none focus:border-[#FF4C1F]"
                        />
                        <textarea 
                          value={editingContent} 
                          onChange={(e) => setEditingContent(e.target.value)}
                          rows={4}
                          className="w-full bg-[#0B0D12] border border-[#252936] p-2.5 rounded-xl text-xs text-[#A89F96] focus:outline-none focus:border-[#FF4C1F] font-mono leading-relaxed"
                        />
                        <div className="flex justify-between items-center">
                          <select 
                            value={editingType} 
                            onChange={(e) => setEditingType(e.target.value as any)}
                            className="bg-[#0B0D12] border border-[#252936] text-[10px] font-black uppercase tracking-wider px-2 py-1.5 rounded-lg text-[#F7EFE7]"
                          >
                            <option value="identidade">Identidade</option>
                            <option value="memoria_relacional">Memória Relacional</option>
                          </select>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingContextId(null)} className="px-2.5 py-1.5 bg-[#252936] hover:bg-[#1C202E] rounded-lg text-[10px] text-[#A89F96] font-bold uppercase">
                              Cancelar
                            </button>
                            <button onClick={saveEditedContext} className="px-3 py-1.5 bg-[#FF4C1F] text-black font-black rounded-lg text-[10px] uppercase flex items-center gap-1">
                              <Save className="w-3 h-3" /> Salvar
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${
                              ctx.tipo === 'identidade' 
                                ? 'bg-[#FF4C1F]/10 text-[#FF4C1F] border-[#FF4C1F]/20' 
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {ctx.tipo === 'identidade' ? 'Identidade' : 'Relação com Ká'}
                            </span>
                            <span className="text-[8px] font-mono text-[#A89F96]">Edição: {ctx.ultimaEdicao}</span>
                          </div>
                          <h4 className="text-sm font-bold text-[#F7EFE7] font-serif">{ctx.titulo}</h4>
                          <p className="text-xs text-[#A89F96] leading-relaxed whitespace-pre-wrap">{ctx.conteudo}</p>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 border-t border-[#252936]/60 mt-4 flex justify-between items-center gap-2 flex-wrap">
                          <div className="flex gap-1.5">
                            <button 
                              onClick={() => toggleContextActive(ctx.id)}
                              className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border ${
                                ctx.ativo 
                                  ? 'bg-[#FF4C1F]/10 border-[#FF4C1F]/30 text-[#FF4C1F]' 
                                  : 'bg-[#10131A] border-[#252936] text-[#A89F96]'
                              }`}
                            >
                              {ctx.ativo ? 'Ativo' : 'Inativo'}
                            </button>
                            <button 
                              onClick={() => toggleContextArchived(ctx.id)}
                              className="p-1 text-[#A89F96] hover:text-[#FF4C1F] hover:bg-[#FF4C1F]/5 rounded-lg transition-colors"
                              title="Arquivar contexto"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => sendSnippetToGarden(ctx.conteudo, ctx.titulo)}
                              className="px-2 py-1 hover:bg-[#FF4C1F]/10 text-[#A89F96] hover:text-[#FF4C1F] border border-transparent hover:border-[#FF4C1F]/20 rounded-lg text-[9px] font-bold uppercase transition-all"
                              title="Enviar este contexto para o Jardim de Memórias"
                            >
                              Semear Jardim
                            </button>
                            <button 
                              onClick={() => startEditContext(ctx)}
                              className="p-1 text-[#A89F96] hover:text-white rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => deleteContext(ctx.id)}
                              className="p-1 text-[#A89F96]/60 hover:text-red-400 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Archived Contexts */}
          {archivedContexts.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-[#252936]/40">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#A89F96]">
                Contextos Arquivados (Fora do Prompt)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
                {archivedContexts.map(ctx => (
                  <div key={ctx.id} className="p-4 rounded-xl bg-[#0B0D12] border border-[#252936] flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-[#F7EFE7] line-clamp-1">{ctx.titulo}</h5>
                      <p className="text-[11px] text-[#A89F96] line-clamp-2 mt-1 leading-normal">{ctx.conteudo}</p>
                    </div>
                    <div className="flex justify-end gap-1.5 mt-3 pt-2 border-t border-[#252936]/60 text-[9px] font-bold uppercase">
                      <button onClick={() => toggleContextArchived(ctx.id)} className="text-[#FF4C1F] hover:underline">
                        Restaurar
                      </button>
                      <span className="text-[#252936]">|</span>
                      <button onClick={() => deleteContext(ctx.id)} className="text-[#A89F96] hover:text-red-400">
                        Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- SEDIMENTOS VIEW ---------------- */}
      {subTab === 'sedimentos' && (
        <div className="space-y-6 animate-fade-in" id="memory-sediments-subtab">
          {/* Header */}
          <div className="bg-[#0B0D12] border border-[#252936] rounded-[32px] p-6 text-[#F7EFE7] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_42px_rgba(234,179,8,0.04)]">
            <div className="absolute right-0 top-0 w-80 h-80 bg-[#EAB308]/3 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EAB308] shadow-[0_0_8px_#EAB308]"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#A89F96]">
                  Anotações da Conversa e Insights
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#F7EFE7] font-serif leading-none">
                Sedimentos Ativos
              </h1>
              <p className="text-xs text-[#A89F96] max-w-xl leading-relaxed">
                Hipóteses e pensamentos colhidos em tempo real durante as interações cotidianas. Requerem curadoria humana para se tornarem memórias locais aprovadas.
              </p>
            </div>
          </div>

          {/* List of Sediments */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A89F96] border-b border-[#252936]/40 pb-1">
              Hipóteses Pendentes de Validação
            </h3>

            {sediments.filter(s => s.status === 'pendente').length === 0 ? (
              <div className="p-8 border border-dashed border-[#252936] rounded-2xl text-center text-[#A89F96] text-xs space-y-2">
                <Sparkles className="w-6 h-6 mx-auto text-[#EAB308] opacity-40" />
                <p>Nenhum sedimento local pendente.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sediments.filter(s => s.status === 'pendente').map(sed => (
                  <div 
                    key={sed.id} 
                    className="p-4 bg-[#10131A] border border-[#252936] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:border-[#EAB308]/20"
                  >
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono uppercase font-black">
                          {sed.source}
                        </span>
                        <span className="text-[9px] text-[#A89F96] font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#A89F96]/70" /> {sed.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-[#F7EFE7] font-semibold leading-relaxed">"{sed.text}"</p>
                    </div>

                    <div className="flex gap-2 shrink-0 self-end sm:self-auto">
                      <button 
                        onClick={() => deleteSediment(sed.id)}
                        className="px-2.5 py-1.5 bg-[#0B0D12] hover:bg-[#FF4C1F]/5 text-[#A89F96] hover:text-red-400 border border-[#252936] rounded-lg text-[9px] font-black uppercase transition-all"
                      >
                        Descartar
                      </button>
                      <button 
                        onClick={() => promoteSedimentToRevision(sed.id)}
                        className="px-3 py-1.5 bg-[#EAB308] hover:bg-yellow-500 text-black rounded-lg text-[9px] font-black uppercase flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(234,179,8,0.1)]"
                      >
                        Enviar para Revisão <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- REVISÃO VIEW ---------------- */}
      {subTab === 'revisao' && (
        <div className="space-y-6 animate-fade-in" id="memory-revision-subtab">
          {/* Header */}
          <div className="bg-[#0B0D12] border border-[#252936] rounded-[32px] p-6 text-[#F7EFE7] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_42px_rgba(234,179,8,0.04)]">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#A89F96]">
                  Curadoria Humana de Conhecimento
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#F7EFE7] font-serif leading-none">
                Revisão Contínua
              </h1>
              <p className="text-xs text-[#A89F96] max-w-xl leading-relaxed">
                Aqui você valida os candidatos a memória. Decida o que vira lembrança no Jardim, o que vira identidade conceitual ou histórico relacional.
              </p>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A89F96] border-b border-[#252936]/40 pb-1">
              Candidatos Gerados por Sedimentação ({sediments.filter(s => s.status === 'revisado').length})
            </h3>

            {sediments.filter(s => s.status === 'revisado').length === 0 ? (
              <div className="p-8 border border-dashed border-[#252936] rounded-2xl text-center text-[#A89F96] text-xs space-y-2">
                <Check className="w-6 h-6 mx-auto text-emerald-400" />
                <p>Nenhum sedimento em revisão. As hipóteses ativas ainda estão sendo destiladas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sediments.filter(s => s.status === 'revisado').map(sed => (
                  <div key={sed.id} className="p-5 bg-[#10131A] border border-emerald-500/20 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-mono text-[#A89F96]">
                      <span>Candidato de Sedimentação • tipo: {sed.source}</span>
                      <span>Colhido em {sed.createdAt}</span>
                    </div>

                    <p className="text-xs text-[#F7EFE7] italic leading-relaxed">"{sed.text}"</p>

                    <div className="flex justify-end gap-2 pt-3 border-t border-[#252936]/60">
                      <button 
                        onClick={() => deleteSediment(sed.id)}
                        className="px-2.5 py-1.5 bg-[#0B0D12] text-[#A89F96] hover:text-red-400 rounded-lg text-[9px] font-black uppercase transition-all"
                      >
                        Recusar
                      </button>
                      <button 
                        onClick={() => {
                          const title = prompt('Dê um título para esta memória:', 'Preferência sobre layout');
                          if (title) approveSedimentToGarden(sed, title, sed.text);
                        }}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-[#06070A] font-black rounded-lg text-[9px] uppercase flex items-center gap-1 transition-all"
                      >
                        Aprovar para o Jardim <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inactive Contexts that can be validated */}
          {contexts.filter(c => !c.ativo && !c.arquivado).length > 0 && (
            <div className="space-y-4 pt-6 border-t border-[#252936]/40">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A89F96]">
                Contextos Importados Pendentes de Ativação ({contexts.filter(c => !c.ativo && !c.arquivado).length})
              </h3>

              <div className="space-y-3">
                {contexts.filter(c => !c.ativo && !c.arquivado).map(ctx => (
                  <div key={ctx.id} className="p-4 bg-[#0B0D12] border border-[#252936] rounded-xl flex flex-col justify-between h-fit gap-3">
                    <div className="space-y-1">
                      <span className="text-[8px] px-2 py-0.5 rounded font-mono bg-[#FF4C1F]/10 text-[#FF4C1F] uppercase border border-[#FF4C1F]/20">
                        {ctx.tipo}
                      </span>
                      <h4 className="text-xs font-bold text-[#F7EFE7]">{ctx.titulo}</h4>
                      <p className="text-xs text-[#A89F96] leading-relaxed line-clamp-2">{ctx.conteudo}</p>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-[#252936]/60">
                      <button onClick={() => toggleContextActive(ctx.id)} className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[9px] font-black rounded-lg uppercase tracking-wider">
                        Ativar Contexto
                      </button>
                      <button onClick={() => approveContextToGarden(ctx)} className="px-3 py-1 bg-[#FF4C1F]/10 hover:bg-[#FF4C1F]/20 text-[#FF4C1F] text-[9px] font-black rounded-lg uppercase tracking-wider">
                        Transformar em Jardim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- JARDIM VIEW ---------------- */}
      {subTab === 'jardim' && (
        <div className="space-y-6 animate-fade-in" id="memory-garden-subtab">
          {/* Header */}
          <div className="bg-[#0B0D12] border border-[#252936] rounded-[32px] p-6 text-[#F7EFE7] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_42px_rgba(16,185,129,0.04)]">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/3 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="space-y-3 z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10B981]"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#A89F96]">
                  Cérebro de Longo Prazo Cultivado
                </span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#F7EFE7] font-serif leading-none">
                Jardim de Memórias
              </h1>
              <p className="text-xs text-[#A89F96] max-w-xl leading-relaxed">
                Repositório de fatos, decisões arquiteturais e preferências de código aprovadas. Cultivado sob regime de revisão espaçada para revisão local.
              </p>
            </div>
          </div>

          {/* Search/Filter or list of memories */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-1.5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A89F96]">
                Memórias Cultivadas Ativas ({garden.filter(g => !g.archived).length})
              </h3>
            </div>

            {garden.filter(g => !g.archived).length === 0 ? (
              <div className="p-8 border border-dashed border-[#252936] rounded-2xl text-center text-[#A89F96] text-xs">Nenhuma memória local aprovada ainda.</div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {garden.filter(g => !g.archived).map(gar => {
                const isEditing = editingGardenId === gar.id;
                return (
                  <div key={gar.id} className="p-5 bg-[#10131A] border border-[#252936] rounded-2xl flex flex-col justify-between h-fit gap-4">
                    {isEditing ? (
                      <div className="space-y-3 w-full">
                        <input 
                          type="text" 
                          value={editingGardenTitle} 
                          onChange={(e) => setEditingGardenTitle(e.target.value)}
                          className="w-full bg-[#0B0D12] border border-[#252936] p-2 rounded-xl text-xs font-bold text-[#F7EFE7]"
                        />
                        <textarea 
                          value={editingGardenContent} 
                          onChange={(e) => setEditingGardenContent(e.target.value)}
                          rows={4}
                          className="w-full bg-[#0B0D12] border border-[#252936] p-2.5 rounded-xl text-xs text-[#A89F96] font-mono leading-relaxed"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[8px] font-black text-[#A89F96] uppercase mb-1">Categoria</label>
                            <select 
                              value={editingGardenCategory} 
                              onChange={(e) => setEditingGardenCategory(e.target.value as any)}
                              className="w-full bg-[#0B0D12] border border-[#252936] text-[10px] p-1.5 rounded-lg text-[#F7EFE7]"
                            >
                              <option value="preferencia">Preferência</option>
                              <option value="usuario">Usuário</option>
                              <option value="kaline">Kaline</option>
                              <option value="ecossistema">Ecossistema</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[8px] font-black text-[#A89F96] uppercase mb-1">Importância</label>
                            <input 
                              type="number" 
                              min="1" 
                              max="5" 
                              value={editingGardenImportance} 
                              onChange={(e) => setEditingGardenImportance(Number(e.target.value))}
                              className="w-full bg-[#0B0D12] border border-[#252936] text-[10px] p-1.5 rounded-lg text-[#F7EFE7]"
                            />
                          </div>
                        </div>
                        <input 
                          type="text" 
                          placeholder="Tags separadas por vírgula"
                          value={editingGardenTags} 
                          onChange={(e) => setEditingGardenTags(e.target.value)}
                          className="w-full bg-[#0B0D12] border border-[#252936] p-2 rounded-xl text-[10px] text-[#A89F96]"
                        />
                        <div className="flex justify-end gap-2 pt-2">
                          <button onClick={() => setEditingGardenId(null)} className="px-2.5 py-1.5 bg-[#252936] rounded-lg text-[10px] text-[#A89F96] uppercase">
                            Cancelar
                          </button>
                          <button onClick={saveEditedGarden} className="px-3 py-1.5 bg-emerald-500 text-[#06070A] font-black rounded-lg text-[10px] uppercase">
                            Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono uppercase font-extrabold tracking-wide">
                              {gar.category}
                            </span>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`w-1 h-1 rounded-full ${i < gar.importance ? 'bg-emerald-400' : 'bg-[#252936]'}`}
                                />
                              ))}
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-[#F7EFE7] font-serif">{gar.title}</h4>
                          <p className="text-xs text-[#A89F96] leading-relaxed whitespace-pre-wrap">"{gar.content}"</p>
                        </div>

                        <div className="pt-3 border-t border-[#252936]/60 mt-4 flex items-center justify-between flex-wrap gap-2 text-[9px] font-mono text-[#A89F96]">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Próxima revisão: {gar.nextReviewAt}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => startEditGarden(gar)} 
                              className="p-1 hover:text-white transition-colors"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => toggleGardenArchived(gar.id)} 
                              className="p-1 hover:text-[#FF4C1F] transition-colors"
                              title="Arquivar memória"
                            >
                              <Archive className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => deleteGarden(gar.id)} 
                              className="p-1 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>
      )}

      {/* --- IMPORT CONTEXT MODAL --- */}
      {showImportModal && (
        <div className="fixed inset-0 bg-[#06070A]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fade-in text-[#F7EFE7]">
            <h3 className="text-base font-black uppercase text-[#F7EFE7] flex items-center gap-1.5">
              <Fingerprint className="w-5 h-5 text-[#FF4C1F]" /> Importar Bloco de Contexto Externo
            </h3>
            
            <p className="text-xs text-[#A89F96] leading-relaxed">
              Cole o bloco de conversas antigas de forma manual. O sistema canônico de presença absorverá o trecho e moldará a identidade operacional da Kaline.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[9px] font-black text-[#A89F96] uppercase tracking-wider mb-1">Título do Bloco</label>
                <input 
                  type="text" 
                  placeholder="Ex: 'Kaline — Voz e preferências'" 
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-[#10131A] border border-[#252936] rounded-xl text-[#F7EFE7] focus:outline-none focus:border-[#FF4C1F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-[#A89F96] uppercase tracking-wider mb-1">Tipo de Contexto</label>
                  <select 
                    value={importType} 
                    onChange={(e) => setImportType(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-[#10131A] border border-[#252936] rounded-xl text-[#F7EFE7] focus:outline-none"
                  >
                    <option value="identidade">Identidade da Kaline</option>
                    <option value="memoria_relacional">Memória Relacional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-[#A89F96] uppercase tracking-wider mb-1">Conteúdo do Bloco</label>
                <textarea 
                  rows={5}
                  placeholder="### CONTEÚDO COPIADO..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full text-xs p-3 bg-[#10131A] border border-[#252936] rounded-xl text-[#F7EFE7] focus:outline-none focus:border-[#FF4C1F] font-mono leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs pt-2">
              <button 
                onClick={() => { setImportTitle(''); setImportText(''); setShowImportModal(false); }}
                className="px-4 py-2 border border-[#252936] hover:bg-[#10131A] text-[#A89F96] font-bold rounded-xl uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button 
                onClick={handleImportContext}
                disabled={!importText.trim()}
                className="px-4 py-2 bg-[#FF4C1F] hover:bg-[#FF7A3D] disabled:opacity-40 text-[#06070A] font-black rounded-xl uppercase tracking-wider shadow-md shadow-[#FF4C1F]/10"
              >
                Absorver Contexto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
