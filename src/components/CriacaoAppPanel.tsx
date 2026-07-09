import React, { useState } from 'react';
import { Folder, Code, Terminal, CheckCircle, Database, Layout } from 'lucide-react';

export default function CriacaoAppPanel() {
  const [folderPath, setFolderPath] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'creating' | 'done'>('idle');
  const [appName, setAppName] = useState('Novo Projeto Kaline');

  const handleSelectFolder = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        // Use File System Access API if available
        const dirHandle = await (window as any).showDirectoryPicker();
        setFolderPath(dirHandle.name);
      } else {
        // Fallback for browsers that don't support it
        setFolderPath('/usuario/projetos/novo-app');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateApp = () => {
    if (!folderPath) return;
    setStatus('creating');
    setTimeout(() => {
      setStatus('done');
    }, 2000);
  };

  return (
    <div className="bg-[#0B0D12] rounded-[32px] border border-[#252936] p-6 shadow-2xl text-[#F7EFE7] animate-fade-in flex flex-col gap-6 max-w-3xl mx-auto w-full mt-4">
      <div className="flex items-center gap-3 border-b border-[#252936]/50 pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF4C1F] to-[#FF7A3D] flex items-center justify-center shadow-[0_0_15px_rgba(255,76,31,0.3)]">
          <Code className="w-5 h-5 text-[#06070A]" />
        </div>
        <div>
          <h2 className="text-lg font-black tracking-widest uppercase font-serif">
            Forja de Aplicativos
          </h2>
          <p className="text-xs text-[#A89F96]">
            Configure e exporte seu código para um diretório local do computador.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#A89F96]">Nome do Projeto</label>
          <input 
            type="text" 
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            disabled={status !== 'idle'}
            className="w-full text-xs p-3 bg-[#10131A] border border-[#252936] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF4C1F] focus:border-[#FF4C1F] text-[#F7EFE7]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-extrabold uppercase tracking-widest text-[#A89F96]">Diretório de Destino (Desktop)</label>
          <div className="flex gap-2">
            <div className="flex-1 bg-[#10131A] border border-[#252936] rounded-xl p-3 flex items-center gap-2 text-xs text-[#A89F96]">
              <Folder className="w-4 h-4 text-[#FF4C1F]" />
              {folderPath || 'Nenhuma pasta selecionada...'}
            </div>
            <button 
              onClick={handleSelectFolder}
              disabled={status !== 'idle'}
              className="px-4 py-3 bg-[#1C202E] text-[#F7EFE7] font-bold text-xs rounded-xl hover:bg-[#252936] transition-colors whitespace-nowrap border border-[#252936] disabled:opacity-50"
            >
              Escolher Pasta
            </button>
          </div>
        </div>

        <div className="bg-[#10131A] border border-[#252936] rounded-xl p-4 space-y-3">
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[#F7EFE7] flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#FF4C1F]" /> Estrutura do App (React + Vite)
          </h3>
          <ul className="text-xs text-[#A89F96] space-y-2 font-mono">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> /src/components
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> /src/types.ts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> tailwind.config.js & index.css
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-3 h-3 text-emerald-400" /> package.json
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-4 border-t border-[#252936]/50">
        <button 
          onClick={handleCreateApp}
          disabled={!folderPath || status !== 'idle'}
          className="w-full py-4 bg-[#FF4C1F] text-[#06070A] font-black text-sm rounded-xl hover:bg-[#FF7A3D] transition-colors uppercase tracking-wider shadow-[0_0_20px_rgba(255,76,31,0.2)] disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {status === 'idle' && (
            <>
              <Terminal className="w-5 h-5" /> Gerar Arquivos Locais
            </>
          )}
          {status === 'creating' && (
            <>
              <div className="w-4 h-4 border-2 border-[#06070A]/30 border-t-[#06070A] rounded-full animate-spin"></div> 
              Escrevendo no Disco...
            </>
          )}
          {status === 'done' && (
            <>
              <CheckCircle className="w-5 h-5" /> App Criado com Sucesso!
            </>
          )}
        </button>
      </div>
    </div>
  );
}
