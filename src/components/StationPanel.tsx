import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  HardDrive, 
  Activity, 
  Settings, 
  Server, 
  Terminal, 
  ExternalLink, 
  RefreshCw, 
  Check, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';
import { fetchHestiaStatus, HestiaStatus } from '../lib/station/hestia-client';

export default function StationPanel() {
  const [hestiaUrl, setHestiaUrl] = useState<string>('http://127.0.0.1:4517');
  const [status, setStatus] = useState<HestiaStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [savingConfig, setSavingConfig] = useState<boolean>(false);
  const [confirmingService, setConfirmingService] = useState<string | null>(null);

  const loadStatus = async () => {
    setLoading(true);
    const data = await fetchHestiaStatus(hestiaUrl);
    setStatus(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStatus();
  }, [hestiaUrl]);

  const toggleService = (svcName: string) => {
    if (!status) return;
    setStatus(prev => {
      if (!prev) return null;
      return {
        ...prev,
        services: prev.services.map(s => 
          s.name === svcName ? { ...s, active: !s.active } : s
        ),
        presence: {
          ...prev.presence,
          recentEvents: [
            { 
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), 
              event: `Serviço '${svcName}' alterado via painel`, 
              level: 'info' 
            },
            ...prev.presence.recentEvents
          ]
        }
      };
    });
  };

  if (!status) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider">Aguardando Héstia Station...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="hestia-station-view">
      {/* Header Banner */}
      <div className="bg-[#0B0D12] border border-[#252936] rounded-[32px] p-6 text-[#F7EFE7] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_42px_rgba(234,179,8,0.06)]">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#EAB308] ${status.online ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' : 'bg-[#EAB308] animate-pulse'}`}></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#A89F96]">
              {status.online ? 'Conexão Direta Loopback' : 'Modo Protegido / Sincronização Ativa'}
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#F7EFE7] font-serif leading-none flex items-center gap-2">
            Héstia Station
          </h1>
          <p className="text-xs text-[#A89F96] max-w-xl leading-relaxed">
            Corpo físico da Kaline. Servidor local físico de armazenamento `/KALINE`, monitoramento de processos nativos e controle de serviços do sistema.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto z-10 shrink-0">
          <div className="flex items-center bg-[#10131A] border border-[#252936] rounded-xl px-3 py-2 text-xs">
            <span className="text-[#A89F96] font-mono text-[9px] mr-2">BASE_URL:</span>
            <input 
              type="text" 
              value={hestiaUrl} 
              onChange={(e) => setHestiaUrl(e.target.value)}
              className="bg-transparent text-[#F7EFE7] font-semibold font-mono text-[11px] focus:outline-none w-36" 
            />
            <button 
              onClick={loadStatus}
              className="ml-2 text-[#A89F96] hover:text-[#EAB308] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <a 
            href={hestiaUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#EAB308] text-black text-[10px] font-black rounded-xl hover:bg-amber-500 transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.2)]"
          >
            Abrir Console Local <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Grid of Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hardware Status */}
        <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] space-y-4 shadow-sm">
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#EAB308]" /> Hardware & Carga
          </h3>
          
          <div className="space-y-3 font-mono text-xs text-[#A89F96]">
            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Uptime:</span>
              <span className="text-[#F7EFE7] font-bold">{status.uptime}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Uso de CPU:</span>
              <span className="text-[#F7EFE7] font-bold">{status.cpu}%</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Memória RAM:</span>
                <span className="text-[#F7EFE7] font-bold">{status.memory.percent}%</span>
              </div>
              <div className="w-full bg-[#10131A] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#EAB308] h-full rounded-full transition-all duration-500"
                  style={{ width: `${status.memory.percent}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-[#A89F96]/50 text-right">{status.memory.used} / {status.memory.total}</p>
            </div>
          </div>
        </div>

        {/* Storage status */}
        <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] space-y-4 shadow-sm">
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#EAB308]" /> Volumes & /KALINE
          </h3>

          <div className="space-y-3 font-mono text-xs text-[#A89F96]">
            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Diretório de Escrita:</span>
              <span className="text-[#EAB308] font-bold">{status.storage.path}</span>
            </div>

            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Notas Localizadas:</span>
              <span className="text-[#F7EFE7] font-bold">{status.storage.kalineFilesCount} arquivos</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Espaço Ocupado:</span>
                <span className="text-[#F7EFE7] font-bold">{status.storage.percent}%</span>
              </div>
              <div className="w-full bg-[#10131A] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#EAB308] h-full rounded-full transition-all duration-500"
                  style={{ width: `${status.storage.percent}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-[#A89F96]/50 text-right">{status.storage.used} / {status.storage.total} total</p>
            </div>
          </div>
        </div>

        {/* Presence / Chameleon */}
        <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] space-y-4 shadow-sm">
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#EAB308]" /> Presença & Atividade
          </h3>

          <div className="space-y-3 font-mono text-xs text-[#A89F96]">
            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Modo Ativo:</span>
              <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {status.presence.mode}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
              <span>Tempo Focado Hoje:</span>
              <span className="text-[#F7EFE7] font-bold">{status.presence.timeInFocusToday}</span>
            </div>

            <div className="space-y-1">
              <span className="block text-[10px] text-[#A89F96]/70">Janela Ativa Registrada:</span>
              <span className="text-xs text-[#F7EFE7] block bg-[#10131A] p-2 rounded border border-[#252936] truncate font-semibold">
                {status.presence.activeWindow}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Management */}
      <div className="bg-[#0B0D12] rounded-[24px] border border-[#252936] p-5 space-y-4 shadow-md">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#F7EFE7] flex items-center gap-2">
          <Settings className="w-4.5 h-4.5 text-[#EAB308]" /> Controle de Serviços Locais (Systemd)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {status.services.map((svc) => (
            <div 
              key={svc.name} 
              className="p-4 bg-[#10131A] border border-[#252936] rounded-2xl flex flex-col justify-between h-28"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-[#F7EFE7] uppercase tracking-tight">{svc.name}</span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-extrabold uppercase ${
                    svc.active 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-[#0B0D12] text-[#A89F96] border border-[#252936]'
                  }`}>
                    {svc.active ? 'Ativo' : 'Parado'}
                  </span>
                </div>
                <p className="text-[10px] text-[#A89F96] leading-tight">{svc.description}</p>
              </div>

              <button 
                onClick={() => toggleService(svc.name)}
                className={`w-full py-1 text-[10px] font-black rounded-lg transition-all uppercase tracking-wider border ${
                  svc.active 
                    ? 'border-[#252936] hover:bg-[#0B0D12] text-[#A89F96]' 
                    : 'bg-[#EAB308] hover:bg-yellow-500 text-black border-transparent shadow-sm'
                }`}
              >
                {svc.active ? 'Parar Serviço' : 'Iniciar Serviço'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Events Log */}
      <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] space-y-3 shadow-md">
        <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#EAB308]" /> Registros e Eventos Recentes de Presença
        </h3>

        <div className="bg-[#10131A] border border-[#252936] rounded-xl p-4 font-mono text-xs space-y-2 h-44 overflow-y-auto no-scrollbar">
          {status.presence.recentEvents.map((ev, i) => (
            <div key={i} className="flex items-start gap-2 border-b border-[#252936]/20 pb-1.5 last:border-0 last:pb-0">
              <span className="text-[#A89F96]/50 font-bold text-[10px] shrink-0">[{ev.time}]</span>
              <span className={`text-[10px] font-medium leading-relaxed ${
                ev.level === 'success' ? 'text-emerald-400' :
                ev.level === 'warn' ? 'text-amber-400' : 'text-[#A89F96]'
              }`}>
                {ev.event}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
