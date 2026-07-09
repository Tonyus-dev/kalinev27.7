import { Habit } from '../types';
import { getRelativeDateString } from '../initialData';
import { 
  Flame, 
  CheckCircle, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

interface HabitStatsViewProps {
  habits: Habit[];
}

export default function HabitStatsView({ habits }: HabitStatsViewProps) {
  const [selectedRange, setSelectedRange] = useState<7 | 14 | 30>(7);

  // Helper to get past dates
  const getPastDates = (count: number): string[] => {
    const dates: string[] = [];
    for (let i = count - 1; i >= 0; i--) {
      dates.push(getRelativeDateString(i));
    }
    return dates;
  };

  const datesRange = getPastDates(selectedRange);

  // Calculate stats
  const totalHabitsCount = habits.length;
  
  // 1. Completion rate in selected range
  let totalLogsExpected = 0;
  let totalLogsCompleted = 0;

  habits.forEach(habit => {
    datesRange.forEach(date => {
      // Check if habit is active on this day
      let isActive = true;
      if (habit.frequency === 'custom' && habit.customDays) {
        const dayOfWeek = new Date(date + 'T12:00:00').getDay(); // Use mid-day to avoid timezone offset shifts
        isActive = habit.customDays.includes(dayOfWeek);
      }
      
      if (isActive) {
        totalLogsExpected += 1;
        const compVal = habit.history[date] || 0;
        if (compVal >= habit.targetValue) {
          totalLogsCompleted += 1;
        } else if (compVal > 0) {
          // Partial completion
          totalLogsCompleted += (compVal / habit.targetValue);
        }
      }
    });
  });

  const completionRate = totalLogsExpected > 0 
    ? Math.round((totalLogsCompleted / totalLogsExpected) * 100) 
    : 0;

  // 2. Streaks metrics
  const bestCurrentStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.streak)) 
    : 0;
    
  const bestAllTimeStreak = habits.length > 0 
    ? Math.max(...habits.map(h => h.maxStreak)) 
    : 0;

  // 3. Perfect Days calculation
  let perfectDaysCount = 0;
  datesRange.forEach(date => {
    let activeHabitsOnDay = 0;
    let completedHabitsOnDay = 0;

    habits.forEach(habit => {
      let isActive = true;
      if (habit.frequency === 'custom' && habit.customDays) {
        const dayOfWeek = new Date(date + 'T12:00:00').getDay();
        isActive = habit.customDays.includes(dayOfWeek);
      }

      if (isActive) {
        activeHabitsOnDay += 1;
        const compVal = habit.history[date] || 0;
        if (compVal >= habit.targetValue) {
          completedHabitsOnDay += 1;
        }
      }
    });

    if (activeHabitsOnDay > 0 && completedHabitsOnDay === activeHabitsOnDay) {
      perfectDaysCount += 1;
    }
  });

  // 4. Calculate completions per habit for rendering a beautiful horizontal comparison bar chart
  const habitsPerformance = habits.map(habit => {
    let expected = 0;
    let completed = 0;

    datesRange.forEach(date => {
      let isActive = true;
      if (habit.frequency === 'custom' && habit.customDays) {
        const dayOfWeek = new Date(date + 'T12:00:00').getDay();
        isActive = habit.customDays.includes(dayOfWeek);
      }

      if (isActive) {
        expected += 1;
        const val = habit.history[date] || 0;
        if (val >= habit.targetValue) completed += 1;
      }
    });

    const percent = expected > 0 ? Math.round((completed / expected) * 100) : 0;
    return {
      name: habit.name,
      completed,
      expected,
      percent,
      color: habit.color,
      icon: habit.icon
    };
  }).sort((a, b) => b.percent - a.percent);

  // 5. Get weekday names in pt-BR
  const getWeekdayInitial = (dateStr: string): string => {
    const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    const date = new Date(dateStr + 'T12:00:00');
    return days[date.getDay()];
  };

  const getDayNumber = (dateStr: string): string => {
    return dateStr.split('-')[2];
  };

  return (
    <div className="space-y-6" id="stats-dashboard">
      {/* Date selector */}
      <div className="flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Período de Análise</span>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {([7, 14, 30] as const).map(range => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRange === range 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
              id={`range-tab-${range}`}
            >
              {range} Dias
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Key Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Taxa de Conclusão */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Taxa Geral</span>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:scale-105 transition-transform origin-left">
              {completionRate}%
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Conclusões com sucesso</p>
          </div>
          {/* Accent Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"></div>
        </div>

        {/* Card 2: Dias Perfeitos */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Dias Perfeitos</span>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:scale-105 transition-transform origin-left">
              {perfectDaysCount}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">100% de hábitos concluídos</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
        </div>

        {/* Card 3: Maior Sequência */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Maior Streak</span>
            <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:scale-105 transition-transform origin-left">
              {bestAllTimeStreak} <span className="text-xs font-medium text-slate-400">dias</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Recorde absoluto de foco</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500"></div>
        </div>

        {/* Card 4: Sequência Atual */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">Streak Atual</span>
            <Flame className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-indigo-600 tracking-tight group-hover:scale-105 transition-transform origin-left">
              {bestCurrentStreak} <span className="text-xs font-medium text-indigo-400">dias</span>
            </div>
            <p className="text-[10px] text-indigo-400 mt-1">Sequência diária ativa</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>
        </div>
      </div>

      {/* Visual Analytics Row: Heatmap Grid and Comparative Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Grid - Inspired by GitHub & Streaks */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900">Histórico de Conclusões</h3>
              <p className="text-[11px] text-slate-400">Visão geral dos últimos {selectedRange} dias</p>
            </div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
              Grelha de Foco
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
            {datesRange.map((date, idx) => {
              // Calculate completion on this day
              let activeCount = 0;
              let compCount = 0;
              
              habits.forEach(habit => {
                let isActive = true;
                if (habit.frequency === 'custom' && habit.customDays) {
                  const dayOfWeek = new Date(date + 'T12:00:00').getDay();
                  isActive = habit.customDays.includes(dayOfWeek);
                }

                if (isActive) {
                  activeCount += 1;
                  if ((habit.history[date] || 0) >= habit.targetValue) {
                    compCount += 1;
                  }
                }
              });

              let colorClass = 'bg-slate-100 hover:bg-slate-200'; // none active or none completed
              if (activeCount > 0) {
                const ratio = compCount / activeCount;
                if (ratio === 1) {
                  colorClass = 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/15'; // 100%
                } else if (ratio >= 0.5) {
                  colorClass = 'bg-indigo-400 text-white'; // high
                } else if (ratio > 0) {
                  colorClass = 'bg-indigo-100 text-indigo-800'; // some
                } else {
                  colorClass = 'bg-rose-50 border border-rose-100 text-rose-500'; // 0% but active
                }
              }

              return (
                <div key={date} className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400">{getWeekdayInitial(date)}</span>
                  <div 
                    className={`w-10 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${colorClass}`}
                    title={`${date}: ${compCount}/${activeCount} concluídos`}
                  >
                    <span className="text-xs font-bold">{getDayNumber(date)}</span>
                    <span className="text-[8px] opacity-75 font-mono">{compCount}/{activeCount}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400 border-t border-slate-100">
            <span>Menos foco</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200 inline-block"></span>
                <span>Sem atividade</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-50 border border-rose-100 inline-block"></span>
                <span>Zero</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-indigo-100 inline-block"></span>
                <span>Parcial</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
                <span>Perfeito</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparative Performance - Gorgeous Custom SVG-like bars */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900">Desempenho de Hábitos</h3>
            <p className="text-[11px] text-slate-400">Hábitos mais consistentes no período</p>
          </div>

          <div className="space-y-3.5">
            {habitsPerformance.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Nenhum hábito cadastrado para exibir estatísticas.
              </div>
            ) : (
              habitsPerformance.slice(0, 5).map((hp, index) => {
                // Determine Tailwind color
                let barColor = 'bg-indigo-600';
                let trackColor = 'bg-indigo-50';
                if (hp.color === 'violet') { barColor = 'bg-violet-500'; trackColor = 'bg-violet-50'; }
                else if (hp.color === 'emerald') { barColor = 'bg-emerald-500'; trackColor = 'bg-emerald-50'; }
                else if (hp.color === 'sky') { barColor = 'bg-sky-500'; trackColor = 'bg-sky-50'; }
                else if (hp.color === 'rose') { barColor = 'bg-rose-500'; trackColor = 'bg-rose-50'; }
                else if (hp.color === 'amber') { barColor = 'bg-amber-500'; trackColor = 'bg-amber-50'; }

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 truncate max-w-[200px]">{hp.name}</span>
                      <span className="font-mono font-bold text-slate-500">
                        {hp.completed}/{hp.expected} <span className="text-[10px] text-slate-400">({hp.percent}%)</span>
                      </span>
                    </div>
                    {/* Bar track */}
                    <div className={`w-full h-2.5 rounded-full ${trackColor} overflow-hidden`}>
                      <div 
                        className={`h-full rounded-full ${barColor} transition-all duration-500`}
                        style={{ width: `${hp.percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
