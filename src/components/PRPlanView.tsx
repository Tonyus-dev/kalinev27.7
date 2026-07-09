import { useState } from 'react';
import { GITHUB_PR_PLAN } from '../initialData';
import { PRStep } from '../types';
import { 
  GitPullRequest, 
  Terminal, 
  Copy, 
  Check, 
  Server, 
  Database, 
  ExternalLink, 
  Sparkles,
  Info
} from 'lucide-react';

export default function PRPlanView() {
  const [selectedPRIndex, setSelectedPRIndex] = useState<number>(0);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [userPRStatus, setUserPRStatus] = useState<Record<number, 'pending' | 'completed'>>({
    0: 'completed', // pre-fill first as completed/ready
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending'
  });

  const selectedPR = GITHUB_PR_PLAN[selectedPRIndex];

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const togglePRStatus = (index: number) => {
    setUserPRStatus(prev => ({
      ...prev,
      [index]: prev[index] === 'completed' ? 'pending' : 'completed'
    }));
  };

  return (
    <div className="space-y-6" id="pr-plan-view-container">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-800/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl -ml-16 -mb-16"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-200 text-xs px-2.5 py-1 rounded-full font-medium border border-indigo-500/30">
              <Sparkles className="w-3 h-3" /> Guia de Produção Fullstack
            </span>
            <h2 className="text-xl font-bold tracking-tight">Roteiro de Deploy: Cloudflare Workers + Supabase</h2>
            <p className="text-indigo-200 text-xs max-w-2xl leading-relaxed">
              O front-end interativo que você vê agora foi desenvolvido de forma modular. Para levá-lo à produção na sua infraestrutura, siga o plano de 5 Pull Requests (PRs) abaixo, contendo código de produção real para o seu banco Supabase e rota servidora no Cloudflare Workers.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="bg-white/10 px-3 py-2 rounded-xl border border-white/10 text-center">
              <div className="text-xs text-indigo-200">Progresso PRs</div>
              <div className="text-lg font-bold text-white">
                {Object.values(userPRStatus).filter(s => s === 'completed').length}/5
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {GITHUB_PR_PLAN.map((pr, index) => {
          const isCompleted = userPRStatus[index] === 'completed';
          const isSelected = selectedPRIndex === index;
          return (
            <button
              key={index}
              onClick={() => { setSelectedPRIndex(index); }}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between h-24 ${
                isSelected 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
              id={`pr-tab-${index}`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${
                  isSelected 
                    ? 'bg-indigo-500 text-indigo-50' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  PR #{index + 1}
                </span>
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={(e) => {
                    e.stopPropagation();
                    togglePRStatus(index);
                  }}
                  className={`w-4 h-4 rounded cursor-pointer ${
                    isSelected ? 'accent-indigo-300' : 'accent-indigo-600'
                  }`}
                  id={`pr-checkbox-${index}`}
                />
              </div>
              
              <div className="mt-2">
                <p className={`text-xs font-semibold line-clamp-2 leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {pr.title.replace(/PR \d+: /, '')}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected PR Detail View */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Detail Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded-full">
                Branch: <code className="font-mono">{selectedPR.branchName}</code>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <GitPullRequest className="w-3.5 h-3.5 text-emerald-500" /> Pull Request Pronto para o GitHub
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{selectedPR.title}</h3>
            <p className="text-slate-600 text-xs max-w-3xl leading-relaxed">{selectedPR.description}</p>
          </div>
          
          <button
            onClick={() => togglePRStatus(selectedPRIndex)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              userPRStatus[selectedPRIndex] === 'completed'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            id={`btn-toggle-pr-status-${selectedPRIndex}`}
          >
            <Check className={`w-4 h-4 ${userPRStatus[selectedPRIndex] === 'completed' ? 'text-emerald-600' : 'text-slate-400'}`} />
            {userPRStatus[selectedPRIndex] === 'completed' ? 'Marcar como Pendente' : 'Marcar como Concluído'}
          </button>
        </div>

        {/* Scope Checklist & Snippet */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Scope */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" /> Escopo do Pull Request
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
              {selectedPR.scope.map((item, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{item}</p>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100/50 space-y-2">
              <h5 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                {selectedPRIndex === 0 && <Database className="w-3.5 h-3.5 text-indigo-600" />}
                {selectedPRIndex === 1 && <Server className="w-3.5 h-3.5 text-indigo-600" />}
                {selectedPRIndex > 1 && <Terminal className="w-3.5 h-3.5 text-indigo-600" />}
                Dica técnica de Integração
              </h5>
              <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                {selectedPRIndex === 0 && "Copie o SQL ao lado e cole diretamente no SQL Editor do console do seu projeto no Supabase. Isso criará instantaneamente as tabelas com relacionamentos e regras de segurança (RLS)."}
                {selectedPRIndex === 1 && "Instale o Hono (npm i hono) e o cliente Supabase na sua pasta de Worker. Esse roteamento leve responde em <10ms na borda do Cloudflare."}
                {selectedPRIndex === 2 && "No front-end, a fila offline garante que os hábitos concluídos continuem salvos na memória local caso o usuário perca o sinal de rede em elevadores ou metrô."}
                {selectedPRIndex === 3 && "iOS impõe restrições estritas a PWAs: o arquivo manifest deve usar caminhos válidos e o usuário deve instalar manualmente pelo botão de compartilhar do Safari."}
                {selectedPRIndex === 4 && "Configure os tokens CLOUDFLARE_API_TOKEN e CLOUDFLARE_ACCOUNT_ID nas 'Secrets' do seu repositório GitHub para ativar o deploy automático ao realizar push na branch main."}
              </p>
            </div>
          </div>

          {/* Code Snippet Box */}
          {selectedPR.codeSnippet && (
            <div className="lg:col-span-7 flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-slate-400" /> {selectedPR.codeSnippetTitle || 'Arquivo de Código'}
                </span>
                
                <button
                  onClick={() => handleCopyCode(selectedPR.codeSnippet || '')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold transition-all"
                  id={`btn-copy-code-${selectedPRIndex}`}
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative grow flex flex-col">
                <div className="flex items-center gap-1.5 px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-mono text-slate-500 ml-2">producao.sql_ou_ts</span>
                </div>
                <pre className="p-4 font-mono text-xs text-slate-300 overflow-auto max-h-[350px] leading-relaxed select-all grow">
                  <code>{selectedPR.codeSnippet}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
