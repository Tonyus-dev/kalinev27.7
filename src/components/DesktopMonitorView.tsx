import { useState, useEffect } from 'react';
import { 
  Monitor, 
  Cpu, 
  Activity, 
  Clock, 
  Terminal, 
  Play, 
  Pause, 
  CheckCircle, 
  Download,
  AlertTriangle,
  RefreshCw,
  AppWindow,
  Zap
} from 'lucide-react';

interface ActiveProcess {
  name: string;
  durationMin: number;
  category: 'productive' | 'neutral' | 'distracting';
  icon: string;
}

export default function DesktopMonitorView() {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(true);
  const [cpuUsage, setCpuUsage] = useState<number>(24);
  const [keypressCount, setKeypressCount] = useState<number>(342);
  const [focusedApp, setFocusedApp] = useState<string>('VS Code - src/App.tsx');
  const [productiveTime, setProductiveTime] = useState<number>(185); // minutes
  const [distractingTime, setDistractingTime] = useState<number>(35); // minutes
  const [isTailscaleActive, setIsTailscaleActive] = useState<boolean>(true);

  // Simulate real-time monitoring changes
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      // Small random changes
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 9) - 4;
        return Math.max(5, Math.min(95, prev + delta));
      });

      setKeypressCount(prev => prev + Math.floor(Math.random() * 3));
      
      // Randomly change focused app occasionally
      const apps = [
        'VS Code - src/App.tsx',
        'Google Chrome - Supabase Console',
        'Terminal (zsh)',
        'Figma - UI Layout Design',
        'Spotify - Deep Focus Playlist'
      ];
      if (Math.random() > 0.85) {
        const nextApp = apps[Math.floor(Math.random() * apps.length)];
        setFocusedApp(nextApp);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const activeProcesses: ActiveProcess[] = [
    { name: 'Visual Studio Code', durationMin: 120, category: 'productive', icon: 'Code' },
    { name: 'Chrome (Console Supabase)', durationMin: 65, category: 'productive', icon: 'Chrome' },
    { name: 'Terminal / npm run dev', durationMin: 45, category: 'productive', icon: 'Terminal' },
    { name: 'Spotify Music', durationMin: 35, category: 'neutral', icon: 'Music' },
    { name: 'YouTube (Lo-fi Beats)', durationMin: 20, category: 'distracting', icon: 'Youtube' }
  ];

  return (
    <div className="space-y-6" id="desktop-monitor-view">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Cliente de Monitoramento Ativo</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Monitor Computador (Desktop Daemon)</h2>
          <p className="text-xs text-slate-500">
            A versão desktop registra seu tempo de foco em aplicativos nativos e sincroniza em tempo real via rede segura do <strong>Tailscale</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isMonitoring 
                ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10'
            }`}
            id="btn-toggle-monitoring"
          >
            {isMonitoring ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pausar Registro
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Iniciar Registro
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Real-time Desktop Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: CPU load */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Carga do Processador</span>
            <Cpu className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              {isMonitoring ? `${cpuUsage}%` : '---'}
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">Sincronizado via Tailscale Daemon</p>
          </div>
        </div>

        {/* Metric 2: Keypress count */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Teclas Digitadas</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">
              {isMonitoring ? keypressCount : '---'} <span className="text-xs font-normal text-slate-400">hoje</span>
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">Indicador de engajamento ativo</p>
          </div>
        </div>

        {/* Metric 3: Active Focused App */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-28 col-span-2">
          <div className="flex justify-between items-start text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Aplicativo em Foco</span>
            <AppWindow className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800 truncate" title={focusedApp}>
              {isMonitoring ? focusedApp : 'Monitoramento Pausado'}
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">Atualizado há poucos segundos</p>
          </div>
        </div>
      </div>

      {/* Productivity chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* App breakdown list */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Distribuição de Tempo em Tela</h3>
              <p className="text-[10px] text-slate-400">Sessões registradas do computador</p>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Lighthouse Safe
            </span>
          </div>

          <div className="space-y-3.5">
            {activeProcesses.map((process, idx) => {
              const total = productiveTime + distractingTime;
              const ratio = Math.round((process.durationMin / total) * 100);
              
              let barColor = 'bg-slate-400';
              if (process.category === 'productive') barColor = 'bg-indigo-600';
              else if (process.category === 'distracting') barColor = 'bg-rose-500';

              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{process.name}</span>
                    <span className="font-mono text-slate-500 text-[11px]">
                      {process.durationMin} min <span className="text-[10px] text-slate-400">({ratio}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${ratio}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          
          <div className="space-y-1.5 relative">
            <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-4 h-4 text-indigo-400" /> Como Funciona o Monitor?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              O monitoramento de computador utiliza um script em background executado na sua máquina (via Python ou Electron).
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300 relative">
            <div className="flex gap-2 items-start bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono font-bold shrink-0">1</span>
              <p className="text-[11px] leading-relaxed"><strong>Rede Segura Tailscale:</strong> A comunicação é peer-to-peer direta e criptografada entre seus dispositivos sem passar por servidores públicos.</p>
            </div>
            
            <div className="flex gap-2 items-start bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono font-bold shrink-0">2</span>
              <p className="text-[11px] leading-relaxed"><strong>Isolamento de Dados:</strong> O script local detecta o título da janela ativa e posta periodicamente para o seu Cloudflare Worker privado.</p>
            </div>
          </div>

          <div className="pt-2 relative">
            <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-950/20 active:scale-95 transition-all">
              <Download className="w-4 h-4" /> Baixar Script Companion (.py / .js)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
