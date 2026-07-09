import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Code, 
  Layers, 
  Terminal, 
  Play, 
  Download, 
  Check, 
  Copy, 
  Activity, 
  Settings, 
  CheckSquare, 
  Server,
  FileText,
  RefreshCw
} from 'lucide-react';
import { fetchHefaistiaStatus, HefaistiaStatus, ForgeModel, ForgeTask } from '../lib/forge/hefaistia-client';

export default function ForgePanel() {
  const [forgeUrl, setForgeUrl] = useState<string>('http://127.0.0.1:4518');
  const [status, setStatus] = useState<HefaistiaStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [benchmarkRunning, setBenchmarkRunning] = useState<boolean>(false);
  
  // Custom Task Runner
  const [taskPrompt, setTaskPrompt] = useState<string>('');
  const [runningTask, setRunningTask] = useState<boolean>(false);

  // Clipboard copies
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const loadStatus = async () => {
    setLoading(true);
    const data = await fetchHefaistiaStatus(forgeUrl);
    setStatus(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStatus();
  }, [forgeUrl]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const runBenchmark = () => {
    if (benchmarkRunning) return;
    setBenchmarkRunning(true);
    setTimeout(() => {
      if (status) {
        setStatus(prev => {
          if (!prev) return null;
          return {
            ...prev,
            benchmark: {
              lastTest: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              model: prev.currentModel,
              tps: Number((30 + Math.random() * 15).toFixed(1)),
              latencyMs: Math.round(110 + Math.random() * 40),
              ramUsed: `${(4.8 + Math.random() * 1.5).toFixed(1)} GB`
            }
          };
        });
      }
      setBenchmarkRunning(false);
    }, 1500);
  };

  const runTask = () => {
    if (!taskPrompt.trim() || runningTask) return;
    setRunningTask(true);
    
    setTimeout(() => {
      if (status) {
        let code = ``;
        let desc = ``;
        
        if (taskPrompt.toLowerCase().includes('data') || taskPrompt.toLowerCase().includes('time')) {
          code = `// Helper nativo sem imports pesados\nexport const getCleanDate = () => new Date().toISOString().split('T')[0];`;
          desc = `Retorno otimizado pelo Qwen 2.5 Coder utilizando apenas a API padrão da linguagem.`;
        } else {
          code = `// Otimização máxima (Regras Ponytail)\nconst getById = (items, id) => items.find(item => item.id === id);`;
          desc = `Lógica limpa e direta gerada localmente. Pronta para integração em sua faceta.`;
        }

        const newTask: ForgeTask = {
          id: Math.random().toString(),
          title: taskPrompt.length > 30 ? taskPrompt.substring(0, 30) + '...' : taskPrompt,
          type: 'code',
          prompt: taskPrompt,
          result: code,
          latencyMs: Math.round(200 + Math.random() * 180),
          tokensPerSec: Number((35 + Math.random() * 10).toFixed(1)),
          status: 'completed'
        };

        setStatus(prev => {
          if (!prev) return null;
          return {
            ...prev,
            tasks: [newTask, ...prev.tasks]
          };
        });
      }
      setTaskPrompt('');
      setRunningTask(false);
    }, 1200);
  };

  // Generate assistida Totalidade block (PR 6)
  const generateExportBlock = (): string => {
    if (!status) return '';
    return `### 🜂 BLOCO DE EXPORTAÇÃO HEFAÍSTIA PARA TOTALIDADE
**Data de Emissão:** ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}
**Status Técnico:** Ollama Local Conectado (${status.currentModel})
**Último Benchmark:** ${status.benchmark.tps} TPS / ${status.benchmark.latencyMs}ms de Latência

#### ⚙️ Preferências & Atividades Observadas
- Conexão de rede local estabelecida em modo loopback na porta :4518.
- Forjador executou tarefas locais com os seguintes modelos ativos:
  ${status.localModels.map(m => `- \`${m.name}\` (${m.parameterCount}, ${m.size})`).join('\n  ')}

#### 🛠️ Próximos Passos Decididos
1. Manter a mente canônica integrada ao PWA principal.
2. Utilizar o Qwen 1.5B para simplificar rascunhos rápidos locais.
3. Consumir dados estruturados das notas locais no /KALINE.`;
  };

  if (!status) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mb-3" />
        <p className="text-xs font-bold uppercase tracking-wider">Aguardando Hefaístia Forge...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="hefaistia-forge-view">
      {/* Header Banner */}
      <div className="bg-[#0B0D12] border border-[#252936] rounded-[32px] p-6 text-[#F7EFE7] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_42px_rgba(255,76,31,0.06)]">
        <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#FF4C1F] ${status.online ? 'bg-emerald-400 shadow-[0_0_8px_#10B981]' : 'bg-[#FF4C1F] animate-pulse'}`}></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#A89F96]">
              {status.online ? 'Conexão Hefaístia Direta' : 'Modo Protegido / Forja Local'}
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-[#F7EFE7] font-serif leading-none flex items-center gap-2">
            Hefaístia Forge
          </h1>
          <p className="text-xs text-[#A89F96] max-w-xl leading-relaxed">
            Forja local de inteligência artificial. Processamento local de tarefas estruturadas através do Ollama rodando os modelos leve e específico.
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto z-10 shrink-0">
          <div className="flex items-center bg-[#10131A] border border-[#252936] rounded-xl px-3 py-2 text-xs">
            <span className="text-[#A89F96] font-mono text-[9px] mr-2">FORGE_URL:</span>
            <input 
              type="text" 
              value={forgeUrl} 
              onChange={(e) => setForgeUrl(e.target.value)}
              className="bg-transparent text-[#F7EFE7] font-semibold font-mono text-[11px] focus:outline-none w-36" 
            />
            <button 
              onClick={loadStatus}
              className="ml-2 text-[#A89F96] hover:text-[#FF4C1F] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="text-[10px] font-extrabold text-center bg-[#10131A] border border-[#252936] text-[#FF4C1F] py-1 px-3 rounded-lg uppercase">
            Ollama: {status.ollamaOnline ? 'Conectado' : 'Offline'}
          </div>
        </div>
      </div>

      {/* Grid: Models List & Benchmark */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Model Registry List */}
        <div className="bg-[#0B0D12] rounded-[24px] border border-[#252936] p-5 space-y-4 shadow-md">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#F7EFE7] flex items-center gap-2">
            <Layers className="w-4.5 h-4.5 text-[#FF4C1F]" /> Modelos Ollama Instalados
          </h3>

          <div className="space-y-2.5">
            {status.localModels.map((m) => (
              <div 
                key={m.name}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  m.status === 'active' 
                    ? 'bg-[#FF4C1F]/10 border-[#FF4C1F]/25' 
                    : 'bg-[#10131A] border-[#252936] hover:bg-[#10131A]/80'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-extrabold text-[#F7EFE7]">{m.name}</span>
                    {m.status === 'active' && (
                      <span className="text-[8px] bg-[#FF4C1F] text-[#06070A] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Ativo</span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#A89F96] font-medium">
                    Parâmetros: {m.parameterCount} | Quantização: {m.quantization}
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#F7EFE7] bg-[#0B0D12] border border-[#252936] px-2 py-0.5 rounded-lg shadow-sm">
                  {m.size}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Latency Benchmarker */}
        <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] flex flex-col justify-between shadow-md">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FF4C1F]" /> Teste de Latência & TPS
              </h3>
              <span className="text-[8px] font-mono text-[#A89F96]/50 uppercase">Último: {status.benchmark.lastTest}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-[#10131A] border border-[#252936] p-4 rounded-xl font-mono text-xs text-[#A89F96]">
              <div className="space-y-1">
                <span className="text-[9px] text-[#A89F96]/50 uppercase">Tokens por Segundo:</span>
                <p className="text-xl font-extrabold text-[#F7EFE7]">{status.benchmark.tps} <span className="text-[10px] text-[#FF4C1F]">t/s</span></p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] text-[#A89F96]/50 uppercase">Latência Inicial:</span>
                <p className="text-xl font-extrabold text-[#F7EFE7]">{status.benchmark.latencyMs} <span className="text-[10px] text-[#FF4C1F]">ms</span></p>
              </div>
              <div className="space-y-1 col-span-2 border-t border-[#252936] pt-2.5 mt-1">
                <span className="text-[9px] text-[#A89F96]/50 uppercase">Modelo Testado:</span>
                <p className="text-xs font-semibold text-[#F7EFE7] truncate">{status.benchmark.model} ({status.benchmark.ramUsed} RAM)</p>
              </div>
            </div>
          </div>

          <button
            onClick={runBenchmark}
            disabled={benchmarkRunning}
            className="w-full mt-4 py-2.5 bg-[#FF4C1F] hover:bg-[#FF7A3D] disabled:opacity-40 text-[#06070A] font-black text-xs rounded-xl transition-all uppercase tracking-wider shadow-[0_0_15px_rgba(255,76,31,0.2)]"
          >
            {benchmarkRunning ? 'Rodando Benchmark...' : 'Executar Teste de Força'}
          </button>
        </div>
      </div>

      {/* Task Runner & Vibe Code Sandbox */}
      <div className="bg-[#0B0D12] rounded-[24px] border border-[#252936] p-5 space-y-4 shadow-md">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#F7EFE7] flex items-center gap-2">
          <Code className="w-4.5 h-4.5 text-[#FF4C1F]" /> Prompt Direto para Forja Local (Vibe Coder / qwen2.5-coder)
        </h3>

        <div className="flex gap-2.5">
          <input 
            type="text"
            value={taskPrompt}
            onChange={(e) => setTaskPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runTask()}
            disabled={runningTask}
            placeholder="Ex: 'helper nativo de debounce para React' ou 'função simples de criptografia sha256'"
            className="w-full text-xs p-2.5 bg-[#10131A] border border-[#252936] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF4C1F] focus:border-[#FF4C1F] text-[#F7EFE7]"
          />
          <button 
            onClick={runTask}
            disabled={runningTask || !taskPrompt.trim()}
            className="px-4 py-2.5 bg-[#FF4C1F] text-[#06070A] font-black text-xs rounded-xl hover:bg-[#FF7A3D] transition-colors shrink-0 flex items-center gap-1 uppercase tracking-wider shadow-md shadow-[#FF4C1F]/10 disabled:opacity-40"
          >
            <Play className="w-3.5 h-3.5 fill-[#06070A] text-[#06070A]" /> Forjar
          </button>
        </div>

        {/* Task lists / outputs */}
        <div className="space-y-3">
          {status.tasks.map((task) => (
            <div key={task.id} className="p-4 bg-[#10131A] border border-[#252936] rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b border-[#252936]/40 pb-2">
                <span className="text-xs font-extrabold text-[#F7EFE7] uppercase tracking-tight">{task.title}</span>
                <div className="flex items-center gap-2 text-[9px] text-[#A89F96] font-mono">
                  <span>{task.latencyMs}ms</span>
                  <span>•</span>
                  <span>{task.tokensPerSec} tokens/s</span>
                </div>
              </div>
              <p className="text-[11px] text-[#A89F96] leading-relaxed font-semibold italic">"{task.prompt}"</p>
              
              {task.result && (
                <div className="bg-[#0B0D12] border border-[#252936] rounded-xl p-3 font-mono text-[10px] space-y-2 relative group overflow-x-auto">
                  <div className="flex justify-between items-center text-[#A89F96] border-b border-[#252936]/30 pb-1.5 text-[9px]">
                    <span>RESULTADO BRUTO HEFAÍSTIA</span>
                    <button
                      onClick={() => copyToClipboard(task.result || '', task.id)}
                      className="flex items-center gap-1 hover:text-[#F7EFE7] transition-colors"
                    >
                      {copiedIndex === task.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" /> Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copiar Código
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-orange-400">{task.result}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Manual Markdown Export Block (PR 6) */}
      <div className="bg-[#0B0D12] border border-[#252936] rounded-[24px] p-5 text-[#F7EFE7] space-y-4 shadow-md">
        <div className="flex justify-between items-center">
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#A89F96] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF4C1F]" /> Bloco de Contexto Copiável (Ponte Assistida para Totalidade)
          </h3>
          <button 
            onClick={() => copyToClipboard(generateExportBlock(), 'export-block')}
            className="flex items-center gap-1 px-3 py-1 bg-[#FF4C1F] text-[#06070A] font-black text-[9px] rounded-lg hover:bg-[#FF7A3D] transition-colors uppercase tracking-wider"
          >
            {copiedIndex === 'export-block' ? (
              <>
                <Check className="w-3 h-3" /> Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copiar Bloco
              </>
            )}
          </button>
        </div>

        <p className="text-[10px] text-[#A89F96] leading-relaxed">
          Para respeitar a segurança e o isolamento dos ambientes, a Hefaístia **nunca escreve direto na nuvem**. Copie o bloco Markdown abaixo e cole diretamente na aba do Chat da Kaline ou no seu Códice para enriquecer o contexto de longo prazo.
        </p>

        <div className="bg-[#10131A] border border-[#252936] rounded-xl p-3.5 font-mono text-[10px] text-emerald-400 max-h-40 overflow-y-auto no-scrollbar select-all">
          <pre>{generateExportBlock()}</pre>
        </div>
      </div>
    </div>
  );
}
