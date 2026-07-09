import { Habit, DailyLog } from '../types';
import { getRelativeDateString } from '../initialData';
import { 
  Sun, 
  SunDim, 
  Moon, 
  Calendar, 
  Flame, 
  Check, 
  Plus, 
  Minus, 
  Heart, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useState } from 'react';

interface TodayDashboardProps {
  habits: Habit[];
  onLogHabit: (habitId: string, value: number) => void;
  dailyLog: DailyLog;
  onSaveDailyLog: (log: Partial<DailyLog>) => void;
  presencaRegime: 'green' | 'yellow' | 'blue' | 'red';
  setPresencaRegime: (regime: 'green' | 'yellow' | 'blue' | 'red') => void;
}

export default function TodayDashboard({ 
  habits, 
  onLogHabit, 
  dailyLog, 
  onSaveDailyLog,
  presencaRegime,
  setPresencaRegime
}: TodayDashboardProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    morning: false,
    afternoon: false,
    night: false,
    all: false
  });
  
  const [reflectionInput, setReflectionInput] = useState<string>(dailyLog.reflection || '');
  const [modalNota, setModalNota] = useState(() => localStorage.getItem('kaline_nota_efemera') || '');
  const todayStr = getRelativeDateString(0);
  
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const activeHabitsToday = habits.filter(habit => {
    if (habit.frequency === 'custom' && habit.customDays) {
      const todayDayOfWeek = new Date().getDay();
      return habit.customDays.includes(todayDayOfWeek);
    }
    return true;
  });

  const groupedHabits = {
    morning: activeHabitsToday.filter(h => h.category === 'morning'),
    afternoon: activeHabitsToday.filter(h => h.category === 'afternoon'),
    night: activeHabitsToday.filter(h => h.category === 'night'),
    all: activeHabitsToday.filter(h => h.category === 'all' || !h.category)
  };

  const handleSaveReflection = () => {
    onSaveDailyLog({ reflection: reflectionInput });
  };

  const getColorClasses = (colorName: string) => {
    const colors: Record<string, { bg: string, text: string, ring: string, border: string, btnBg: string }> = {
      violet: {
        bg: 'bg-violet-900/20 text-violet-400',
        text: 'text-violet-400',
        ring: 'stroke-violet-500/30',
        border: 'border-violet-500/20',
        btnBg: 'hover:bg-violet-900/30 text-violet-400 disabled:opacity-30'
      },
      emerald: {
        bg: 'bg-emerald-900/20 text-emerald-400',
        text: 'text-emerald-400',
        ring: 'stroke-emerald-500/30',
        border: 'border-emerald-500/20',
        btnBg: 'hover:bg-emerald-900/30 text-emerald-400 disabled:opacity-30'
      },
      amber: {
        bg: 'bg-amber-900/20 text-amber-400',
        text: 'text-amber-400',
        ring: 'stroke-amber-500/30',
        border: 'border-amber-500/20',
        btnBg: 'hover:bg-amber-900/30 text-amber-400 disabled:opacity-30'
      },
      blue: {
        bg: 'bg-blue-900/20 text-blue-400',
        text: 'text-blue-400',
        ring: 'stroke-blue-500/30',
        border: 'border-blue-500/20',
        btnBg: 'hover:bg-blue-900/30 text-blue-400 disabled:opacity-30'
      },
      rose: {
        bg: 'bg-rose-900/20 text-rose-400',
        text: 'text-rose-400',
        ring: 'stroke-rose-500/30',
        border: 'border-rose-500/20',
        btnBg: 'hover:bg-rose-900/30 text-rose-400 disabled:opacity-30'
      },
      indigo: {
        bg: 'bg-indigo-900/20 text-indigo-400',
        text: 'text-indigo-400',
        ring: 'stroke-indigo-500/30',
        border: 'border-indigo-500/20',
        btnBg: 'hover:bg-indigo-900/30 text-indigo-400 disabled:opacity-30'
      }
    };
    return colors[colorName] || colors.indigo;
  };

  return (
    <div className="px-1.5 py-4 sm:px-6 space-y-6 max-w-3xl mx-auto font-sans text-[#F7EFE7] w-full min-w-0 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#252936]">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-widest uppercase text-[#FF4C1F] flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /> Hoje
          </h2>
          <p className="text-xs sm:text-sm text-[#A89F96] font-mono tracking-wider mt-1">{todayStr}</p>
        </div>
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#FF4C1F]/10 rounded-full border border-[#FF4C1F]/20">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF4C1F]" />
        </div>
      </div>

      {/* Habits Sections */}
      <div className="space-y-4">
        {[
          { id: 'morning', label: 'Manhã', icon: Sun, color: 'text-amber-400' },
          { id: 'afternoon', label: 'Tarde', icon: SunDim, color: 'text-orange-400' },
          { id: 'night', label: 'Noite', icon: Moon, color: 'text-indigo-400' },
          { id: 'all', label: 'A Qualquer Momento', icon: Check, color: 'text-slate-400' }
        ].map(section => {
          const sectionHabits = groupedHabits[section.id as keyof typeof groupedHabits];
          if (sectionHabits.length === 0) return null;
          
          const isCollapsed = collapsedSections[section.id];
          
          return (
            <div key={section.id} className="bg-[#0B0D12] rounded-2xl border border-[#252936] overflow-hidden shadow-lg w-full">
              <button 
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-[#10131A] hover:bg-[#252936]/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <section.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${section.color}`} />
                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#F7EFE7]">{section.label}</h3>
                  <span className="bg-[#252936] text-[#A89F96] text-[10px] px-2 py-0.5 rounded-full font-bold ml-2">
                    {sectionHabits.length}
                  </span>
                </div>
                <div className={`w-5 h-5 flex items-center justify-center rounded-full bg-[#252936] text-[#A89F96] transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                  <Minus className="w-3 h-3" />
                </div>
              </button>
              
              {!isCollapsed && (
                <div className="p-1.5 sm:p-4 space-y-3 w-full">
                  {sectionHabits.map(habit => {
                    const progressVal = habit.history[todayStr] || 0;
                    const isFullyCompleted = progressVal >= habit.targetValue;
                    const pct = Math.min(100, Math.round((progressVal / habit.targetValue) * 100));
                    const style = getColorClasses(habit.color);
                    
                    const radius = 20;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDashoffset = circumference - (pct / 100) * circumference;

                    return (
                      <div key={habit.id} className={`group flex items-center justify-between p-1.5 sm:p-4 rounded-xl border gap-2 transition-all ${isFullyCompleted ? 'bg-[#10131A] border-[#252936] opacity-60' : 'bg-[#0B0D12] border-[#252936] hover:border-[#FF4C1F]/30'}`}>
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                          {/* Circular Progress */}
                          <button 
                            onClick={() => {
                              if (isFullyCompleted) onLogHabit(habit.id, 0);
                              else onLogHabit(habit.id, habit.targetValue);
                            }}
                            className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 rounded-full hover:scale-105 active:scale-95 transition-transform"
                          >
                            <svg className="w-11 h-11 sm:w-12 sm:h-12 transform -rotate-90 absolute">
                              <circle 
                                cx="50%" 
                                cy="50%" 
                                r={radius} 
                                className="stroke-[#252936] fill-none" 
                                strokeWidth="3"
                              />
                              <circle 
                                cx="50%" 
                                cy="50%" 
                                r={radius} 
                                className={`fill-none transition-all duration-300 ${style.ring}`} 
                                strokeWidth="3"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFullyCompleted ? style.bg : 'bg-[#252936] text-[#A89F96] group-hover:bg-[#252936]/80'}`}>
                              {isFullyCompleted ? (
                                <Check className="w-4 h-4 text-emerald-400 stroke-[3px]" />
                              ) : (
                                <span className={`text-[9px] sm:text-[10px] font-bold ${style.text}`}>
                                  {progressVal}/{habit.targetValue}
                                </span>
                              )}
                            </div>
                          </button>
                          
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className={`text-xs sm:text-sm font-bold truncate leading-snug ${isFullyCompleted ? 'text-[#A89F96] line-through' : 'text-[#F7EFE7]'}`}>
                                {habit.name}
                              </h4>
                              {habit.streak > 0 && (
                                <span className="inline-flex items-center gap-0.5 bg-[#FF4C1F]/10 text-[#FF4C1F] text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold border border-[#FF4C1F]/20">
                                  <Flame className="w-3 h-3 fill-[#FF4C1F]/80 stroke-none" /> {habit.streak}d
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] sm:text-[10px] text-[#A89F96] line-clamp-1 leading-normal mt-0.5">
                              {habit.description}
                            </p>
                          </div>
                        </div>
                        
                        {/* Increment / Decrement Counters */}
                        <div className="flex items-center gap-0.5 bg-[#10131A] border border-[#252936] p-0.5 sm:p-1 rounded-xl shrink-0 ml-1.5">
                          <button
                            onClick={() => onLogHabit(habit.id, Math.max(0, progressVal - 1))}
                            disabled={progressVal === 0}
                            className={`p-0.5 sm:p-1.5 rounded-lg transition-colors ${style.btnBg}`}
                          >
                            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          
                          <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#F7EFE7] px-0.5 text-center min-w-[1.25rem] sm:min-w-[2rem]">
                            {progressVal}
                          </span>
                          
                          <button
                            onClick={() => onLogHabit(habit.id, Math.min(habit.targetValue, progressVal + 1))}
                            disabled={isFullyCompleted}
                            className={`p-0.5 sm:p-1.5 rounded-lg transition-colors ${style.btnBg}`}
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Semaphore & Reflection section */}
      <div className="bg-[#0B0D12] rounded-2xl border border-[#252936] p-4 sm:p-5 shadow-lg space-y-6">
        
        {/* Semaphore Replacing Mood */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-[#FF4C1F]/10 text-[#FF4C1F] border border-[#FF4C1F]/20">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-[#F7EFE7] uppercase tracking-wider">Semáforo de Presença</h3>
              <p className="text-[9px] sm:text-[10px] text-[#A89F96]">Como estou me sentindo hoje?</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { key: 'green', label: '🟢 Verde', desc: 'Fluxo aberto', detail: 'Médio/longo, propor, plano, até 3 caminhos' },
              { key: 'yellow', label: '🟡 Amarelo', desc: 'Atenção mediada', detail: 'Curto-médio, menos densidade, até 2 caminhos' },
              { key: 'blue', label: '🔵 Azul', desc: 'Presença calma', detail: 'Curto, baixa estimulação, 1 caminho guiado' },
              { key: 'red', label: '🔴 Vermelho', desc: 'Limite ativo', detail: 'Muito curto, conter/pausar, 0 opções novas' }
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => {
                  localStorage.setItem('kaline_presenca_regime', chip.key);
                  setPresencaRegime(chip.key as any);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                  presencaRegime === chip.key
                    ? 'bg-[#FF4C1F]/10 border-[#FF4C1F] shadow-[0_0_15px_rgba(255,76,31,0.15)] text-white'
                    : 'bg-[#10131A] border-[#252936] text-[#A89F96] hover:border-[#252936]/80'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest">{chip.label}</span>
                  {presencaRegime === chip.key && <span className="w-1.5 h-1.5 rounded-full bg-[#FF4C1F] animate-ping"></span>}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] sm:text-xs font-bold block text-[#F7EFE7]">{chip.desc}</span>
                  <span className="text-[8px] opacity-70 block leading-tight">{chip.detail}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#A89F96] block">
              Nota efêmera para esta conversa:
            </label>
            <textarea
              value={modalNota}
              onChange={(e) => {
                const txt = e.target.value.slice(0, 280);
                setModalNota(txt);
                localStorage.setItem('kaline_nota_efemera', txt);
              }}
              placeholder="Ex: 'responde mais seco', 'estou cansado, vai direto', 'preciso de decisão técnica'"
              className="w-full text-xs p-3 border border-[#252936] rounded-xl focus:outline-none focus:ring-[#FF4C1F]/30 focus:border-[#FF4C1F] text-[#F7EFE7] bg-[#10131A] h-18 resize-none"
            />
            <div className="flex justify-between text-[8px] font-mono text-[#A89F96]">
              <span>Não vira memória. Vale só como modulação local.</span>
              <span>{modalNota.length}/280</span>
            </div>
            {modalNota && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    setModalNota('');
                    localStorage.setItem('kaline_nota_efemera', '');
                  }}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A89F96] hover:text-[#FF4C1F] bg-[#10131A] rounded-xl border border-[#252936] transition-all"
                >
                  Limpar Nota
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[#252936] pt-6 space-y-3">
          <label className="text-[10px] font-bold text-[#A89F96] uppercase tracking-wider block flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#A89F96]" /> Reflexão Noturna do Dia
          </label>
          <textarea
            value={reflectionInput}
            onChange={(e) => setReflectionInput(e.target.value)}
            placeholder="O que funcionou bem hoje? O que posso ajustar amanhã para manter o foco?"
            className="w-full text-xs p-3 border border-[#252936] rounded-xl focus:outline-none focus:ring-[#FF4C1F]/30 focus:border-[#FF4C1F] resize-none h-20 text-[#F7EFE7] bg-[#10131A]"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveReflection}
              className="px-4 py-2 bg-[#FF4C1F] hover:bg-[#FF7A3D] text-[#06070A] rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all shadow-lg"
            >
              Salvar Reflexão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
