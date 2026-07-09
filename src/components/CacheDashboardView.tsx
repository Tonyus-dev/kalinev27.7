import React, { useState, useEffect } from 'react';
import { Database, Zap, DollarSign, Activity, RefreshCw, Server, AlertTriangle } from 'lucide-react';
import { cacheStatsTracker, CacheStats, CacheType } from '../lib/CacheStatsTracker';

export default function CacheDashboardView() {
  const [stats, setStats] = useState<Record<CacheType, CacheStats>>(cacheStatsTracker.getStats());

  useEffect(() => {
    const unsubscribe = cacheStatsTracker.subscribe(() => {
      setStats({ ...cacheStatsTracker.getStats() });
    });
    return unsubscribe;
  }, []);

  const calculateHitRate = (hits: number, misses: number) => {
    const total = hits + misses;
    if (total === 0) return 0;
    return Math.round((hits / total) * 100);
  };

  const StatCard = ({ title, cacheType, icon: Icon, colorClass, highlightClass }: { title: string, cacheType: CacheType, icon: any, colorClass: string, highlightClass: string }) => {
    const stat = stats[cacheType];
    const hitRate = calculateHitRate(stat.hits, stat.misses);
    
    return (
      <div className={`bg-[#0B0D12] border border-[#252936] rounded-2xl p-5 space-y-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${colorClass}`} />
            <h3 className={`text-sm font-black text-[#F7EFE7] font-serif`}>{title}</h3>
          </div>
          <div className={`text-xl font-serif font-bold ${highlightClass}`}>{hitRate}%</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#10131A] rounded-lg p-3 border border-[#252936]">
            <div className="text-[9px] font-black uppercase tracking-wider text-[#A89F96] mb-1">Hits</div>
            <div className={`text-lg font-mono ${highlightClass}`}>{stat.hits}</div>
          </div>
          <div className="bg-[#10131A] rounded-lg p-3 border border-[#252936]">
            <div className="text-[9px] font-black uppercase tracking-wider text-[#A89F96] mb-1">Misses</div>
            <div className="text-lg font-mono text-[#F7EFE7]">{stat.misses}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-[#A89F96] pt-2 border-t border-[#252936]">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>Savings: ${stat.estimatedSavingsUsd.toFixed(4)}</span>
          </div>
          <div>
            {stat.lastHitAt ? `Last hit: ${new Date(stat.lastHitAt).toLocaleTimeString()}` : 'No hits yet'}
          </div>
        </div>
      </div>
    );
  };

  const totalSavings = (Object.values(stats) as CacheStats[]).reduce((acc, s) => acc + s.estimatedSavingsUsd, 0);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#F7EFE7] font-serif tracking-widest uppercase">Estação de Cache</h2>
          <p className="text-[10px] text-[#A89F96] tracking-widest uppercase font-bold">Monitoramento de Latência & Tokens</p>
        </div>
        <button 
          onClick={() => cacheStatsTracker.resetStats()}
          className="p-2 bg-[#10131A] border border-[#252936] rounded-xl hover:bg-[#252936] text-[#A89F96] hover:text-[#F7EFE7] transition-colors"
          title="Resetar Estatísticas"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#10131A] to-[#0B0D12] border border-[#FF4C1F]/20 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-[#FF4C1F] mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> Total Economizado (Est.)
          </div>
          <div className="text-3xl font-serif text-[#F7EFE7]">
            ${totalSavings.toFixed(4)}
          </div>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-[#FF4C1F]/20 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-[#FF4C1F]" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black tracking-widest uppercase text-[#A89F96] flex items-center gap-1.5">
          <Activity className="w-3 h-3" /> Desempenho dos Middlewares
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard 
            title="Semantic Cache (Local)" 
            cacheType="semantic" 
            icon={Database} 
            colorClass="text-[#3B82F6]" 
            highlightClass="text-[#3B82F6]" 
          />
          <StatCard 
            title="Prompt Cache (Gemini)" 
            cacheType="prompt_gemini" 
            icon={Server} 
            colorClass="text-[#10B981]" 
            highlightClass="text-[#10B981]" 
          />
          <StatCard 
            title="Prompt Cache (OpenRouter)" 
            cacheType="prompt_openrouter" 
            icon={Server} 
            colorClass="text-[#8B5CF6]" 
            highlightClass="text-[#8B5CF6]" 
          />
        </div>
      </div>
      
      <div className="bg-[#0B0D12] border border-[#252936] rounded-2xl p-5 flex gap-3 text-[#A89F96]">
        <AlertTriangle className="w-5 h-5 shrink-0 text-[#FFB020]" />
        <p className="text-[10px] leading-relaxed">
          O <strong>Semantic Cache</strong> bypassa o LLM completamente ao encontrar uma "Sedimentação" compatível via busca vetorial local simulada, reduzindo custo a zero. 
          O <strong>Prompt Cache</strong> renova o token do sistema de cache nativo da API de destino, economizando tokens de input quando a janela de contexto se mantém estável.
        </p>
      </div>
    </div>
  );
}
