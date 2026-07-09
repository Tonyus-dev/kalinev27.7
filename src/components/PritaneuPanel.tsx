import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Layers, 
  Server, 
  Zap, 
  Database, 
  Cloud, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Smartphone, 
  Laptop,
  Check,
  Copy,
  Plus,
  Compass,
  ArrowRight,
  Activity
} from 'lucide-react';
import { fetchHestiaStatus, HestiaStatus } from '../lib/station/hestia-client';
import { fetchHefaistiaStatus, HefaistiaStatus } from '../lib/forge/hefaistia-client';
import { APP_REGISTRY } from '../lib/app-registry';

interface PritaneuPanelProps {
  onNavigateTab: (tabId: string) => void;
}

export default function PritaneuPanel({ onNavigateTab }: PritaneuPanelProps) {
  const [hestia, setHestia] = useState<HestiaStatus | null>(null);
  const [forge, setForge] = useState<HefaistiaStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showImportDialog, setShowImportDialog] = useState<boolean>(false);
  const [pasteBlock, setPasteBlock] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const [hData, fData] = await Promise.all([
      fetchHestiaStatus(),
      fetchHefaistiaStatus()
    ]);
    setHestia(hData);
    setForge(fData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImportBlock = () => {
    if (!pasteBlock.trim()) return;
    setImportSuccess(true);
    setTimeout(() => {
      setPasteBlock('');
      setImportSuccess(false);
      setShowImportDialog(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="pritaneu-hub-view">
      {/* Hero "Fogo Central" */}
      <div className="border border-[#FF4C1F]/28 rounded-[32px] p-6 text-[#F7EFE7] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_42px_rgba(255,76,31,0.15)] bg-gradient-to-b from-white/5 to-white/[0.018] bg-[#0B0D12]">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#FF4C1F]/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF4C1F] shadow-[0_0_8px_#FF4C1F] animate-pulse"></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#A89F96]">
              Kaline Pritaneu v27 • Fogo Central da Estação
            </span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#F7EFE7] font-serif leading-none">
            Kaline Pritaneu
          </h1>
          <p className="text-xs text-[#A89F96] max-w-xl leading-relaxed">
            O fogo central entre a nuvem, a estação e a forja.
          </p>
          <div className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-mono text-[#FF4C1F]">
            <span>├─ Totalidade online.</span>
            <span>├─ Héstia observa.</span>
            <span>├─ Hefaístia executa.</span>
          </div>
        </div>

        <button 
          onClick={loadData}
          className="px-4 py-2.5 bg-[#FF4C1F]/8 border border-[#FF4C1F]/28 hover:bg-[#FF4C1F]/15 text-[#F7EFE7] text-[10px] font-black rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 shrink-0 z-10"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#FF4C1F] ${loading ? 'animate-spin' : ''}`} /> Atualizar Hub
        </button>
      </div>

      {/* Grid: 3 Pillars Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Totalidade Card */}
        <div className="system-card p-5 text-[#F7EFE7] flex flex-col justify-between relative overflow-hidden" data-active="true">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A89F96]">Mente Canônica</span>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-2 py-0.5 rounded border border-emerald-500/20 uppercase">Online</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black uppercase text-[#C98A65]">Totalidade</h3>
              <p className="text-[11px] text-[#A89F96] leading-relaxed">
                Shell canônico principal. Diálogos, memórias de longo prazo, controle visual das facetas e conexões de rede seguras.
              </p>
            </div>

            {/* Cloud States */}
            <div className="space-y-2 pt-3 border-t border-[#252936] font-mono text-[10px] text-[#A89F96]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-[#C98A65]" /> Supabase DB:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">Ativo <CheckCircle className="w-3 h-3 text-emerald-400" /></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Cloud className="w-3.5 h-3.5 text-[#C98A65]" /> OpenRouter API:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">Conectado <CheckCircle className="w-3 h-3 text-emerald-400" /></span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('kaline')}
            className="mt-6 w-full py-2 border border-[#C98A65]/20 hover:border-[#C98A65] text-[#C98A65] text-[10px] font-black rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1 bg-[#C98A65]/5"
          >
            Ir para Chat Kaline <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Héstia Card */}
        <div className="system-card p-5 text-[#F7EFE7] flex flex-col justify-between relative overflow-hidden" data-active="true">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A89F96]">Estação Física</span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                hestia?.online 
                  ? 'bg-amber-600/10 text-amber-400 border-amber-500/20' 
                  : 'bg-amber-500/5 text-amber-400 border-amber-500/20 animate-pulse'
              }`}>
                {hestia?.online ? 'Loopback Real' : 'Local Protegido'}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black uppercase text-[#EAB308]">Héstia Station</h3>
              <p className="text-[11px] text-[#A89F96] leading-relaxed">
                Servidor físico e daemon de monitoramento de processos. Volume `/KALINE` local para armazenamento e sincronização de notas.
              </p>
            </div>

            {/* Station States */}
            <div className="space-y-2 pt-3 border-t border-[#252936] font-mono text-[10px] text-[#A89F96]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-[#EAB308]" /> Host Local:</span>
                <span className="text-[#F7EFE7] font-bold">127.0.0.1:4517</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-[#EAB308]" /> Presença Ativa:</span>
                <span className="text-emerald-400 font-bold truncate max-w-[120px] text-right">
                  {hestia?.presence.mode || 'Aguardando'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('station')}
            className="mt-6 w-full py-2 border border-[#EAB308]/20 hover:border-[#EAB308] text-[#EAB308] text-[10px] font-black rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1 bg-[#EAB308]/5"
          >
            Ver Estação Héstia <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hefaístia Card */}
        <div className="system-card p-5 text-[#F7EFE7] flex flex-col justify-between relative overflow-hidden" data-active="true">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#A89F96]">Forja de IA</span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                forge?.online 
                  ? 'bg-orange-600/10 text-orange-400 border-orange-500/20' 
                  : 'bg-orange-500/5 text-orange-400 border-orange-500/20'
              }`}>
                {forge?.online ? 'Loopback Real' : 'Forja Acesa'}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black uppercase text-[#FF4C1F]">Forja Local</h3>
              <p className="text-[11px] text-[#A89F96] leading-relaxed">
                Motor e forjador local de IA. Executa benchmarks de tokens por segundo e orquestra tarefas estruturadas locais no Ollama.
              </p>
            </div>

            {/* Forge States */}
            <div className="space-y-2 pt-3 border-t border-[#252936] font-mono text-[10px] text-[#A89F96]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-orange-500" /> Host Local:</span>
                <span className="text-[#F7EFE7] font-bold">127.0.0.1:4518</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-orange-500" /> Modelo Ativo:</span>
                <span className="text-orange-400 font-bold truncate max-w-[120px] text-right">
                  {forge?.currentModel || 'modelo-local'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigateTab('forge')}
            className="mt-6 w-full py-2 border border-[#FF4C1F]/20 hover:border-[#FF4C1F] text-[#FF4C1F] text-[10px] font-black rounded-lg uppercase tracking-wider transition-all flex items-center justify-center gap-1 bg-[#FF4C1F]/5"
          >
            Forjar IA Local <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Registry Facets overview */}
      <div className="bg-[#0B0D12] rounded-[24px] border border-[#252936] p-5 space-y-4 shadow-md">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="space-y-0.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#F7EFE7] flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-[#FF4C1F]" /> Registro de Facetas & Domínios Ativos
            </h3>
            <p className="text-[10px] text-[#A89F96]">Orquestração canônica da Kaline baseada no APP_REGISTRY.</p>
          </div>

          {/* Import assistant button */}
          <button 
            onClick={() => setShowImportDialog(true)}
            className="px-3 py-1.5 bg-[#FF4C1F] hover:bg-[#FF7A3D] text-[#06070A] font-black text-[10px] rounded-lg uppercase tracking-wider transition-colors flex items-center gap-1 shadow-[0_0_15px_rgba(255,76,31,0.25)]"
          >
            <Plus className="w-3.5 h-3.5" /> Importar Bloco Local
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(APP_REGISTRY).map((domain) => (
            <div 
              key={domain.id} 
              className="p-4 bg-[#10131A] border border-[#252936] rounded-2xl space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: domain.color, color: domain.color }}></span>
                  <span className="font-mono text-xs font-extrabold text-[#F7EFE7] uppercase tracking-tight">{domain.name}</span>
                </div>
                <p className="text-[10px] text-[#A89F96] leading-relaxed">{domain.description}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#252936]">
                <span className="block text-[8px] font-extrabold uppercase tracking-wider text-[#A89F96]/70">Superfícies:</span>
                <div className="space-y-1">
                  {domain.surfaces.map(s => (
                    <div key={s.id} className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-[#A89F96] font-bold">{s.name}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[7px] font-extrabold uppercase ${
                        s.status === 'real' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : s.status === 'mock' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-[#0B0D12] text-[#A89F96] border border-[#252936]'
                      }`}>
                        {s.status === 'real' ? 'Ativa' : s.status === 'mock' ? 'Simulada' : 'Planejada'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Assisted Import Modal Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-[#06070A]/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B0D12] rounded-[24px] border border-[#252936] max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black uppercase text-[#F7EFE7] flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-[#FF4C1F]" /> Importar Bloco de Contexto Local
            </h3>
            
            <p className="text-xs text-[#A89F96] leading-relaxed">
              Cole o bloco Markdown exportado de forma assistida da sua forja <strong>Hefaístia</strong> ou <strong>Héstia Station</strong>. A mente canônica absorverá e classificará esta informação sem pontes automatizadas inseguras.
            </p>

            <textarea
              rows={6}
              value={pasteBlock}
              onChange={(e) => setPasteBlock(e.target.value)}
              placeholder="### BLOCO DE EXPORTAÇÃO HEFAÍSTIA..."
              className="w-full p-3 bg-[#10131A] border border-[#252936] rounded-xl text-xs font-mono text-[#F7EFE7] focus:outline-none focus:ring-1 focus:ring-[#FF4C1F] focus:border-[#FF4C1F]"
            />

            <div className="flex justify-end gap-2 text-xs">
              <button 
                onClick={() => { setPasteBlock(''); setShowImportDialog(false); }}
                className="px-4 py-2 border border-[#252936] hover:bg-[#10131A] text-[#A89F96] font-bold rounded-xl uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button 
                onClick={handleImportBlock}
                disabled={!pasteBlock.trim() || importSuccess}
                className="px-4 py-2 bg-[#FF4C1F] hover:bg-[#FF7A3D] disabled:opacity-40 text-[#06070A] font-black rounded-xl uppercase tracking-wider shadow-md shadow-[#FF4C1F]/10"
              >
                {importSuccess ? 'Sedimentando...' : 'Absorver e Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
