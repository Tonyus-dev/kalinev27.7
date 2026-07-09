import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle2, Circle, Plus, List, ChevronLeft, ChevronRight, CalendarDays, MoreHorizontal } from 'lucide-react';

interface Ritual {
  id: string;
  time: string;
  title: string;
  completed: boolean;
  type: 'routine' | 'task' | 'meeting';
}

const DAILY_RITUALS: Ritual[] = [
  { id: '1', time: '07:00', title: 'Despertar e Hidratação', completed: true, type: 'routine' },
  { id: '2', time: '07:30', title: 'Treino de Força (Hipertrofia)', completed: true, type: 'routine' },
  { id: '3', time: '09:00', title: 'Revisão de PRs e Planejamento Hefaístia', completed: false, type: 'task' },
  { id: '4', time: '11:00', title: 'Alinhamento com Cliente VIP', completed: false, type: 'meeting' },
  { id: '5', time: '14:00', title: 'Deep Work: Frontend', completed: false, type: 'task' },
  { id: '6', time: '18:00', title: 'Leitura: Códice / Klio', completed: false, type: 'routine' },
  { id: '7', time: '22:00', title: 'Ritual de Desligamento', completed: false, type: 'routine' },
];

export default function AgendaPanel() {
  const [rituals, setRituals] = useState<Ritual[]>(() => {
    const saved = localStorage.getItem('kaline_agenda_rituals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DAILY_RITUALS;
      }
    }
    return DAILY_RITUALS;
  });

  useEffect(() => {
    localStorage.setItem('kaline_agenda_rituals', JSON.stringify(rituals));
  }, [rituals]);
  const [view, setView] = useState<'day' | 'week'>('day');

  const toggleRitual = (id: string) => {
    setRituals(prev => prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  const handleNewRitual = () => {
    const title = prompt('Nome do novo compromisso:');
    if (!title) return;
    
    const time = prompt('Horário (ex: 15:30):', '12:00');
    if (!time) return;
    
    let type = prompt('Tipo (routine | task | meeting):', 'task');
    if (type !== 'routine' && type !== 'meeting') type = 'task';
    
    const newRitual: Ritual = {
      id: Date.now().toString(),
      title,
      time,
      type: type as 'routine' | 'task' | 'meeting',
      completed: false
    };
    
    setRituals(prev => {
      const updated = [...prev, newRitual];
      // Sort by time
      return updated.sort((a, b) => a.time.localeCompare(b.time));
    });
  };

  const deleteRitual = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Deletar este compromisso?')) {
      setRituals(prev => prev.filter(r => r.id !== id));
    }
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase();
  };

  const today = new Date();
  
  // Generate days for the week view
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return d;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="agenda-pessoal-view">
      {/* Hero Section */}
      <div className="border border-[#C98A65]/28 rounded-[32px] p-6 text-[#F7EFE7] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_0_42px_rgba(201,138,101,0.15)] bg-gradient-to-b from-white/5 to-white/[0.018] bg-[#0B0D12]">
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#C98A65]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C98A65] shadow-[0_0_8px_#C98A65]"></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#A89F96]">
              Kaline Agenda • V27
            </span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-[#F7EFE7] font-serif leading-none">
            Agenda Pessoal
          </h1>
          <p className="text-xs text-[#A89F96] max-w-xl leading-relaxed">
            Gestão do tempo, rituais diários e compromissos. O controle da forma sobre o fluxo das horas.
          </p>
        </div>

        <button onClick={handleNewRitual} className="px-4 py-2.5 bg-[#C98A65] hover:bg-[#D59875] text-[#06070A] font-black text-[10px] rounded-xl transition-all uppercase tracking-wider flex items-center gap-1.5 shrink-0 z-10 shadow-[0_0_15px_rgba(201,138,101,0.25)]">
          <Plus className="w-3.5 h-3.5" /> Novo Compromisso
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sidebar / Mini Calendar */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-[#10131A] rounded-[24px] border border-[#252936] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#F7EFE7]">
                {today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
              </h3>
              <div className="flex gap-1">
                <button className="p-1 rounded-lg hover:bg-[#252936] text-[#A89F96] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1 rounded-lg hover:bg-[#252936] text-[#A89F96] transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-[10px] font-bold text-[#A89F96]">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Simplistic calendar grid for the current month view */}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isToday = day === today.getDate();
                const isPast = day < today.getDate();
                
                return (
                  <button 
                    key={i} 
                    className={`w-7 h-7 mx-auto rounded-full text-xs flex items-center justify-center transition-colors ${
                      isToday ? 'bg-[#C98A65] text-[#06070A] font-bold' : 
                      isPast ? 'text-[#A89F96]/40 hover:bg-[#252936]' : 
                      'text-[#F7EFE7] hover:bg-[#252936]'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Someday / Backlog */}
          <div className="bg-[#10131A] rounded-[24px] border border-[#252936] p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#A89F96] mb-3 flex items-center gap-2">
              <List className="w-4 h-4" /> Someday / Backlog
            </h3>
            <div className="space-y-2">
              {['Configurar backup do TrueNAS', 'Revisar Códice Mnemósine', 'Atualizar dependências do Forge'].map((task, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-lg hover:bg-[#252936] cursor-pointer group transition-colors">
                  <div className="w-4 h-4 rounded-full border border-[#444] group-hover:border-[#C98A65] flex items-center justify-center"></div>
                  <span className="text-[#A89F96] group-hover:text-[#F7EFE7] transition-colors">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Agenda Area */}
        <div className="lg:col-span-8 bg-[#10131A] rounded-[24px] border border-[#252936] p-5 flex flex-col min-h-[500px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#F7EFE7]">
                {today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h2>
              <p className="text-xs text-[#A89F96] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 
                {rituals.filter(r => r.completed).length} de {rituals.length} rituais concluídos
              </p>
            </div>

            <div className="flex items-center bg-[#0B0D12] p-1 rounded-xl border border-[#252936]">
              <button 
                onClick={() => setView('day')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${view === 'day' ? 'bg-[#252936] text-[#C98A65]' : 'text-[#A89F96] hover:text-[#F7EFE7]'}`}
              >
                <List className="w-3.5 h-3.5" /> Hoje
              </button>
              <button 
                onClick={() => setView('week')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${view === 'week' ? 'bg-[#252936] text-[#C98A65]' : 'text-[#A89F96] hover:text-[#F7EFE7]'}`}
              >
                <CalendarDays className="w-3.5 h-3.5" /> Semana
              </button>
            </div>
          </div>

          {view === 'day' ? (
            <div className="space-y-4 flex-1">
              {/* Daily Timeline */}
              <div className="relative border-l-2 border-[#252936] ml-3 pl-5 space-y-8 py-2">
                {rituals.map(ritual => (
                  <div key={ritual.id} className="relative group">
                    <button 
                      onClick={() => toggleRitual(ritual.id)}
                      className="absolute -left-[30px] top-1 bg-[#10131A] p-0.5 rounded-full transition-transform active:scale-95"
                    >
                      {ritual.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#C98A65]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#444] group-hover:text-[#C98A65]" />
                      )}
                    </button>
                    
                    <div className={`p-4 rounded-xl border transition-all ${
                      ritual.completed 
                        ? 'bg-[#0B0D12] border-[#252936] opacity-60' 
                        : 'bg-[#252936]/40 border-[#252936] hover:border-[#C98A65]/30'
                    }`}>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] font-black tracking-wider text-[#A89F96] uppercase mb-1 block">
                            {ritual.time}
                          </span>
                          <h4 className={`text-sm font-semibold ${ritual.completed ? 'text-[#A89F96] line-through' : 'text-[#F7EFE7]'}`}>
                            {ritual.title}
                          </h4>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                            ritual.type === 'meeting' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            ritual.type === 'task' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            'bg-[#C98A65]/10 text-[#C98A65] border-[#C98A65]/20'
                          }`}>
                            {ritual.type}
                          </span>
                          <button onClick={(e) => deleteRitual(ritual.id, e)} className="text-[10px] text-[#FF4C1F] opacity-0 group-hover:opacity-100 transition-opacity">
                            Deletar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-[#252936] rounded-xl overflow-hidden flex flex-col">
              <div className="grid grid-cols-7 border-b border-[#252936] bg-[#0B0D12]">
                {weekDays.map((d, i) => (
                  <div key={i} className={`p-2 text-center border-r border-[#252936] last:border-r-0 ${d.getDate() === today.getDate() ? 'bg-[#C98A65]/10' : ''}`}>
                    <div className="text-[10px] uppercase text-[#A89F96] font-bold">{getDayName(d)}</div>
                    <div className={`text-sm font-bold mt-0.5 ${d.getDate() === today.getDate() ? 'text-[#C98A65]' : 'text-[#F7EFE7]'}`}>{d.getDate()}</div>
                  </div>
                ))}
              </div>
              <div className="flex-1 grid grid-cols-7 relative">
                {/* Background grid lines */}
                <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                   {weekDays.map((_, i) => (
                    <div key={i} className="border-r border-[#252936] last:border-r-0 h-full"></div>
                   ))}
                </div>
                
                {/* Example events */}
                <div className="col-start-1 col-span-7 h-full p-2 relative">
                  <div className="absolute top-10 left-2 w-[calc(100%/7-16px)] p-2 bg-[#C98A65]/10 border border-[#C98A65]/20 rounded text-[9px] text-[#C98A65] font-bold">
                    07:00<br/>Treino
                  </div>
                  <div className="absolute top-32 left-[calc(100%/7*3+8px)] w-[calc(100%/7-16px)] p-2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-400 font-bold">
                    14:00<br/>Deep Work
                  </div>
                  <div className="absolute top-44 left-[calc(100%/7*5+8px)] w-[calc(100%/7-16px)] p-2 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] text-indigo-400 font-bold">
                    18:30<br/>Call VIP
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
