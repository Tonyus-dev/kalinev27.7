import React, { useState, useEffect } from 'react';
import { Server, HardDrive, Activity, List, ShieldCheck, CheckCircle, AlertTriangle, Play, Square, Settings, Download } from 'lucide-react';

interface HestiaStatus {
  online: boolean;
  server?: any;
  storage?: any;
  services?: any;
  events?: any;
  config?: any;
  capabilities?: any;
  error?: string;
}

export default function HestiaStationPanel() {
  const [status, setStatus] = useState<HestiaStatus>({ online: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHestiaData();
  }, []);

  const fetchHestiaData = async () => {
    setLoading(true);
    try {
      // Tenta buscar da Héstia local em 127.0.0.1:4517
      const res = await fetch('http://127.0.0.1:4517/api/server/status');
      if (!res.ok) throw new Error('Héstia não respondeu ok');
      const server = await res.json();
      
      const storageRes = await fetch('http://127.0.0.1:4517/api/storage/status').catch(() => null);
      const storage = storageRes?.ok ? await storageRes.json() : null;

      const servicesRes = await fetch('http://127.0.0.1:4517/api/services/status').catch(() => null);
      const services = servicesRes?.ok ? await servicesRes.json() : null;

      const eventsRes = await fetch('http://127.0.0.1:4517/api/logs').catch(() => null);
      const events = eventsRes?.ok ? await eventsRes.json() : null;
      
      const capabilitiesRes = await fetch('http://127.0.0.1:4517/api/presence/capabilities').catch(() => null);
      const capabilities = capabilitiesRes?.ok ? await capabilitiesRes.json() : null;

      setStatus({
        online: true,
        server,
        storage,
        services,
        events,
        capabilities
      });
    } catch (error) {
      console.warn("Héstia Local não detectada:", error);
      setStatus({ online: false, error: 'Héstia Station não detectada em 127.0.0.1:4517. Instale e inicie o pacote .deb localmente.' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-[#FF4C1F]/30 border-t-[#FF4C1F] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!status.online) {
    return (
      <div className="bg-[#0B0D12] rounded-[32px] border border-[#252936] p-8 max-w-4xl mx-auto mt-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#10131A] border border-[#252936] flex items-center justify-center mx-auto text-[#FF4C1F]">
          <Server className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-serif font-black text-[#F7EFE7] tracking-widest uppercase mb-2">
            Héstia Station Offline
          </h2>
          <p className="text-sm text-[#A89F96]">
            {status.error}
          </p>
        </div>
        <div className="bg-[#10131A] p-4 rounded-xl border border-[#252936] text-left inline-block">
          <h3 className="text-xs font-bold text-[#F7EFE7] mb-2 uppercase tracking-wider">Checklist de Setup (Linux Mint):</h3>
          <ul className="text-xs text-[#A89F96] space-y-2 font-mono">
            <li>1. Gere o pacote .deb da Héstia através do sistema.</li>
            <li>2. Instale com: <code className="text-[#FF4C1F]">sudo dpkg -i hestia-console.deb</code></li>
            <li>3. Inicie: <code className="text-[#FF4C1F]">systemctl start hestia-console</code></li>
            <li>4. Configure o armazenamento real em <code className="text-[#F7EFE7]">/KALINE</code>.</li>
            <li>5. Retorne a este painel.</li>
          </ul>
        </div>
        <div>
          <button 
            onClick={fetchHestiaData}
            className="px-6 py-2.5 bg-[#FF4C1F] text-[#06070A] font-black text-xs rounded-xl hover:bg-[#FF7A3D] transition-colors uppercase tracking-wider"
          >
            Tentar Reconectar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0D12] rounded-[32px] border border-[#252936] p-6 text-[#F7EFE7] max-w-6xl mx-auto w-full mt-4 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[#252936]/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4C1F] to-[#FF7A3D] flex items-center justify-center shadow-[0_0_15px_rgba(255,76,31,0.3)]">
            <Server className="w-5 h-5 text-[#06070A]" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-widest uppercase font-serif">Héstia Station</h2>
            <p className="text-xs text-[#A89F96]">Host: 127.0.0.1:4517 • Base Operacional Local</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/30 border border-emerald-900/50 rounded-lg text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Online
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card: Estado da Héstia */}
        <div className="bg-[#111016] border border-[#252936] p-4 rounded-2xl flex flex-col gap-3">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#D9A441] flex items-center gap-2">
            <Activity className="w-4 h-4" /> Estado da Máquina
          </h3>
          <div className="space-y-2 text-xs font-mono text-[#A89F96]">
            <p>OS: <span className="text-[#F3EBDD]">{status.server?.os || 'Linux Mint Xfce'}</span></p>
            <p>Uptime: <span className="text-[#F3EBDD]">{status.server?.uptime ? Math.floor(status.server.uptime / 3600) + 'h' : 'N/A'}</span></p>
            <p>Memória: <span className="text-[#F3EBDD]">{status.server?.memory || 'N/A'}</span></p>
            <p>CPU: <span className="text-[#F3EBDD]">{status.server?.cpuLoad || 'N/A'}</span></p>
          </div>
        </div>

        {/* Card: Armazenamento /KALINE */}
        <div className="bg-[#111016] border border-[#252936] p-4 rounded-2xl flex flex-col gap-3">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#C98A65] flex items-center gap-2">
            <HardDrive className="w-4 h-4" /> Armazenamento
          </h3>
          <div className="space-y-2 text-xs font-mono text-[#A89F96]">
            {status.storage?.kaline ? (
              <>
                <p>Diretório: <span className="text-[#F3EBDD]">/KALINE</span></p>
                <p>Tamanho: <span className="text-[#F3EBDD]">{status.storage.kaline.size}</span></p>
                <p>Usado: <span className="text-[#FF6A2A]">{status.storage.kaline.used}</span></p>
                <p>Livre: <span className="text-[#F3EBDD]">{status.storage.kaline.free}</span></p>
              </>
            ) : (
              <p className="text-[#FF6A2A] italic">/KALINE não encontrado no sistema de arquivos.</p>
            )}
          </div>
        </div>

        {/* Card: Serviços Locais */}
        <div className="bg-[#111016] border border-[#252936] p-4 rounded-2xl flex flex-col gap-3">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#F7EFE7] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#FF4C1F]" /> Serviços Essenciais
          </h3>
          <div className="space-y-2 text-xs font-mono text-[#A89F96]">
            {status.services && status.services.length > 0 ? (
              status.services.map((svc: any) => (
                <div key={svc.name} className="flex justify-between items-center">
                  <span>{svc.name}</span>
                  <span className={svc.active ? 'text-emerald-400' : 'text-[#FF6A2A]'}>
                    {svc.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))
            ) : (
              <p>Nenhum serviço mapeado (Jellyfin/Tailscale/Samba depende de configuração manual).</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Card: Eventos Recentes */}
        <div className="bg-[#111016] border border-[#252936] p-4 rounded-2xl flex flex-col gap-3">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#F7EFE7] flex items-center gap-2">
            <List className="w-4 h-4 text-[#FF4C1F]" /> Eventos JSONL (Hoje)
          </h3>
          <div className="bg-[#0B0D12] p-3 rounded-xl border border-[#252936] max-h-40 overflow-y-auto text-[10px] font-mono space-y-1">
            {status.events && status.events.length > 0 ? (
              status.events.map((evt: any, i: number) => (
                <div key={i} className="text-[#A89F96]">
                  <span className="text-[#FF4C1F]">{evt.timestamp}</span> [{evt.level}] {evt.message}
                </div>
              ))
            ) : (
              <p className="text-[#A89F96]/50 italic">Sem eventos registrados hoje.</p>
            )}
          </div>
        </div>

        {/* Card: Capacidades & Presence */}
        <div className="bg-[#111016] border border-[#252936] p-4 rounded-2xl flex flex-col gap-3">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-[#F7EFE7] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#FF4C1F]" /> Presence / Chama Local
          </h3>
          <div className="flex flex-wrap gap-2 text-[9px] uppercase tracking-wider font-bold">
            {status.capabilities ? (
              Object.entries(status.capabilities).map(([key, value]) => (
                <div key={key} className={`px-2 py-1 rounded border ${value ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-400' : 'bg-[#1C202E] border-[#252936] text-[#A89F96]'}`}>
                  {key}: {value ? 'SIM' : 'NÃO'}
                </div>
              ))
            ) : (
              <div className="text-[#A89F96] text-xs font-mono">Presence pode consultar resumos locais.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
