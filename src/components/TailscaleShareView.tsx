import React, { useState, useRef } from 'react';
import { 
  Network, 
  Laptop, 
  Smartphone, 
  Server, 
  ArrowRight, 
  File, 
  UploadCloud, 
  CheckCircle, 
  Share2, 
  HelpCircle,
  Clock,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

interface TailscalePeer {
  name: string;
  ip: string;
  os: 'Windows' | 'macOS' | 'iOS' | 'Android' | 'Linux';
  status: 'online' | 'offline';
  isThisDevice?: boolean;
}

interface SharedFile {
  id: string;
  name: string;
  size: string;
  sender: string;
  receiver: string;
  timestamp: string;
  status: 'sent' | 'received' | 'pending';
}

export default function TailscaleShareView() {
  const [peers, setPeers] = useState<TailscalePeer[]>([
    { name: 'iphone-antonio', ip: '100.82.124.9', os: 'iOS', status: 'online' },
    { name: 'macbook-antonio', ip: '100.82.124.43', os: 'macOS', status: 'online', isThisDevice: true },
    { name: 'pc-trabalho', ip: '100.82.124.11', os: 'Windows', status: 'online' },
    { name: 'servidor-casa', ip: '100.82.124.2', os: 'Linux', status: 'offline' }
  ]);
  
  const [transfers, setTransfers] = useState<SharedFile[]>([
    { id: '1', name: 'rotina_diaria_backup.json', size: '12 KB', sender: 'macbook-antonio', receiver: 'iphone-antonio', timestamp: 'Hoje, 09:24', status: 'sent' },
    { id: '2', name: 'foto_perfil.jpeg', size: '1.4 MB', sender: 'iphone-antonio', receiver: 'macbook-antonio', timestamp: 'Ontem, 18:41', status: 'received' }
  ]);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedReceiver, setSelectedReceiver] = useState<string>('iphone-antonio');
  const [copiedKey, setCopiedKey] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateFileTransfer = (fileName: string, fileSizeStr: string) => {
    const newFile: SharedFile = {
      id: crypto.randomUUID(),
      name: fileName,
      size: fileSizeStr,
      sender: 'macbook-antonio', // Active device
      receiver: selectedReceiver,
      timestamp: 'Agora mesmo',
      status: 'pending'
    };

    setTransfers(prev => [newFile, ...prev]);

    // Simulate progress complete after 2 seconds
    setTimeout(() => {
      setTransfers(prev => prev.map(f => f.id === newFile.id ? { ...f, status: 'sent' } : f));
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;
      simulateFileTransfer(file.name, sizeStr);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;
      simulateFileTransfer(file.name, sizeStr);
    }
  };

  const copyTailscaleIP = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6" id="tailscale-share-view">
      {/* Network Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shrink-0">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Rede Criptografada Tailscale (Tailnet)</h2>
              <p className="text-xs text-slate-500">Conectando seus dispositivos de forma segura para sincronização offline de rotina e arquivos.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Conectado
            </span>
          </div>
        </div>

        {/* Peer Nodes list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {peers.map((peer, idx) => {
            const isOnline = peer.status === 'online';
            return (
              <div 
                key={idx} 
                className={`p-3.5 rounded-xl border transition-all ${
                  peer.isThisDevice 
                    ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' 
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {peer.os === 'iOS' || peer.os === 'Android' ? (
                      <Smartphone className="w-4 h-4 text-slate-500" />
                    ) : (
                      <Laptop className="w-4 h-4 text-slate-500" />
                    )}
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{peer.name}</span>
                  </div>
                  
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-medium text-slate-500">{peer.ip}</span>
                  <button 
                    onClick={() => copyTailscaleIP(peer.ip)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                    title="Copiar IP da Tailnet"
                  >
                    <Copy className="w-3 h-3" /> Copiar
                  </button>
                </div>

                {peer.isThisDevice && (
                  <span className="mt-2 inline-block text-[8px] font-bold tracking-wider text-indigo-700 bg-indigo-100/50 px-1.5 py-0.5 rounded uppercase">
                    Este Dispositivo
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of File Transfer & Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Drag and Drop Transfer Area */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-slate-500" /> Enviar Arquivo via Taildrop
            </h3>
            <p className="text-[10px] text-slate-400">Arraste backups, imagens ou notas de rotina para compartilhar instantaneamente.</p>
          </div>

          {/* Receiver Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Selecione o Dispositivo de Destino</label>
            <select 
              value={selectedReceiver} 
              onChange={(e) => setSelectedReceiver(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
              id="tailscale-receiver-select"
            >
              {peers.filter(p => !p.isThisDevice).map((peer, idx) => (
                <option key={idx} value={peer.name}>
                  {peer.name} ({peer.ip})
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 h-40 ${
              isDragging 
                ? 'border-indigo-600 bg-indigo-50/50' 
                : 'border-slate-200 hover:border-slate-300 bg-slate-50/20 hover:bg-slate-50/60'
            }`}
            id="tailscale-dragbox"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              id="tailscale-file-input"
            />
            <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-indigo-600 animate-bounce' : 'text-slate-400'}`} />
            <div>
              <p className="text-xs font-bold text-slate-700">Arraste ou clique para enviar arquivo</p>
              <p className="text-[10px] text-slate-400 mt-1">Qualquer arquivo de backup, fotos ou relatórios de rotina</p>
            </div>
          </div>

          {/* Transfer Logs list */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Histórico de Compartilhamentos</h4>
            <div className="divide-y divide-slate-100 max-h-44 overflow-y-auto no-scrollbar">
              {transfers.map((file, idx) => (
                <div key={file.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
                      <File className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-700 truncate">{file.name}</p>
                      <p className="text-[9px] text-slate-400">{file.size} • Para: {file.receiver}</p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {file.status === 'pending' ? (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full animate-pulse-slow">
                        Enviando...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Enviado
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Technical Integration details */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 to-indigo-950 text-indigo-100 p-5 rounded-2xl border border-indigo-850 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-300" /> Guia de Configuração Tailscale
            </h3>
            <p className="text-[11px] text-indigo-200 leading-relaxed">
              Tailscale cria uma VPN de malha segura de confiança zero entre todos os seus dispositivos. Para parear o mobile com o desktop privado:
            </p>
          </div>

          <div className="space-y-3.5 py-1">
            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-lg bg-indigo-800 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0">1</span>
              <div>
                <h4 className="text-xs font-bold text-white">Instale o aplicativo</h4>
                <p className="text-[10px] text-indigo-200 leading-relaxed">Instale o app oficial do Tailscale em ambos os dispositivos (Chrome/Windows/macOS/Linux e iOS App Store).</p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-lg bg-indigo-800 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0">2</span>
              <div>
                <h4 className="text-xs font-bold text-white">Ative o Taildrop</h4>
                <p className="text-[10px] text-indigo-200 leading-relaxed">Nas configurações de recursos do console Tailscale, habilite o Taildrop. Isso permite que seus dispositivos enviem arquivos diretamente uns para os outros.</p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <span className="w-5 h-5 rounded-lg bg-indigo-800 text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0">3</span>
              <div>
                <h4 className="text-xs font-bold text-white">Adicione chaves de sincronização</h4>
                <p className="text-[10px] text-indigo-200 leading-relaxed">Insira sua chave de autenticação nas variáveis de ambiente do Cloudflare Worker para permitir que a API verifique a presença de peers e autorize requisições baseadas no IP Tailscale de origem.</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950/60 p-3 rounded-xl border border-indigo-850/50">
            <h4 className="text-xs font-bold text-white mb-1">Como usar para sincronização de rotina?</h4>
            <p className="text-[10px] text-indigo-200 leading-relaxed">
              O front-end PWA detecta se o celular está na mesma subrede Tailnet do desktop e prioriza as chamadas diretas de sincronização Local-First para evitar custos de banda de internet global.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
