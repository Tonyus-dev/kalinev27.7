import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  BarChart2, 
  Monitor, 
  Share2, 
  MessageSquare, 
  CloudLightning,
  Smartphone,
  Laptop,
  Flame,
  Server,
  Eye,
  Leaf,
  Fingerprint,
  HelpCircle,
  Menu,
  X,
  Shield,
  Mic,
  CalendarDays,
  User,
  Database
} from 'lucide-react';

import TodayDashboard from './components/TodayDashboard';
import HabitStatsView from './components/HabitStatsView';
import DesktopMonitorView from './components/DesktopMonitorView';
import TailscaleShareView from './components/TailscaleShareView';
import CacheDashboardView from './components/CacheDashboardView';
//  from './components/TailscaleShareView';
import KalineChat from './components/KalineChat';
import InstallPrompt from './components/InstallPrompt';

import PritaneuPanel from './components/PritaneuPanel';
import StationPanel from './components/StationPanel';
import MemoryPanel from './components/MemoryPanel';
import GuardiaoPanel from './components/GuardiaoPanel';
import AgendaPanel from './components/AgendaPanel';
import BrandingPanel from './components/BrandingPanel';
import PerfilPanel from './components/PerfilPanel';
import { CavernaEcoPanel } from './components/CavernaEcoPanel';
import HestiaStationPanel from './components/HestiaStationPanel';
import ModoFalaPanel from './components/ModoFalaPanel';

import { INITIAL_HABITS, getRelativeDateString } from './initialData';
import { Habit, DailyLog } from './types';

type TabType = 'today' | 'stats' | 'monitor' | 'tailscale' | 'kaline' | 'caverna' | 'pritaneu' | 'station' | 'revisao' | 'jardim' | 'sedimentos' | 'guardiao' | 'agenda' | 'perfil';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('kaline');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [kalineVersion, setKalineVersion] = useState<'V27' | 'V27b'>(() => {
    return (localStorage.getItem('kaline_version') as 'V27' | 'V27b') || 'V27';
  });

  useEffect(() => {
    localStorage.setItem('kaline_version', kalineVersion);
    window.dispatchEvent(new CustomEvent('kalineVersionChanged', { detail: kalineVersion }));
  }, [kalineVersion]);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Semaphore (Semáforo) Global States
  const [presencaRegime, setPresencaRegime] = useState<'green' | 'yellow' | 'blue' | 'red'>('green');

  // Sync regime state from localStorage dynamically
  useEffect(() => {
    const syncRegime = () => {
      const val = (localStorage.getItem('kaline_presenca_regime') as any) || 'green';
      setPresencaRegime(val);
    };
    syncRegime();
    const interval = setInterval(syncRegime, 1000);

    const handleOpenSemaphore = () => {
      syncRegime();
      setActiveTab('today');
    };
    window.addEventListener('open-semaphore', handleOpenSemaphore);

    return () => {
      clearInterval(interval);
      window.removeEventListener('open-semaphore', handleOpenSemaphore);
    };
  }, []);

  // Local-First States
  const [habits, setHabits] = useState<Habit[]>(() => {
    const stored = localStorage.getItem('kaline_habits');
    return stored ? JSON.parse(stored) : INITIAL_HABITS;
  });

  const todayStr = getRelativeDateString(0);

  const [dailyLog, setDailyLog] = useState<DailyLog>(() => {
    const stored = localStorage.getItem(`kaline_log_${todayStr}`);
    return stored ? JSON.parse(stored) : {
      date: todayStr,
      mood: null,
      reflection: ''
    };
  });

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem('kaline_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(`kaline_log_${todayStr}`, JSON.stringify(dailyLog));
  }, [dailyLog, todayStr]);

  // Log Habit actions
  const handleLogHabit = (habitId: string, value: number) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const history = { ...h.history, [todayStr]: value };
        
        // Dynamic streak calculation
        let streak = h.streak;
        const previouslyCompleted = (h.history[todayStr] || 0) >= h.targetValue;
        const nowCompleted = value >= h.targetValue;

        if (nowCompleted && !previouslyCompleted) {
          streak += 1;
        } else if (!nowCompleted && previouslyCompleted) {
          streak = Math.max(0, streak - 1);
        }

        return {
          ...h,
          history,
          streak,
          maxStreak: Math.max(h.maxStreak, streak)
        };
      }
      return h;
    }));
  };

  const handleSaveDailyLog = (updated: Partial<DailyLog>) => {
    setDailyLog(prev => ({ ...prev, ...updated }));
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleNavigate = (e: any) => setActiveTab(e.detail);
    window.addEventListener('navigateTab', handleNavigate);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('navigateTab', handleNavigate);
      
    };
  }, []);


  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;
    
    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;
    
    // Check if the swipe is mostly horizontal
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;

      if (isLeftSwipe) {
        if (activeTab === 'today') setActiveTab('kaline');
      }
      if (isRightSwipe) {
        if (activeTab === 'kaline') setActiveTab('today');
      }
    }
  };
  const tabs = [
    { id: 'pritaneu', label: 'Pritaneu Hub', icon: Flame, category: 'Centro' },
    { id: 'today', label: 'Totalidade', icon: CheckSquare, category: 'Centro' },
    { id: 'agenda', label: 'Agenda Pessoal', icon: CalendarDays, category: 'Centro' },
    { id: 'kaline', label: 'Kaline Chat', icon: MessageSquare, category: 'Centro' },
    { id: 'caverna', label: 'Caverna do Eco', icon: Mic, category: 'Centro' },
    { id: 'guardiao', label: 'Guardião (Admin)', icon: Shield, category: 'Centro' },
    { id: 'perfil', label: 'Perfil', icon: User, category: 'Centro' },
    { id: 'station', label: 'Héstia Station', icon: Server, category: 'Estação' },
    { id: 'monitor', label: 'Computador', icon: Monitor, category: 'Estação' },
    { id: 'tailscale', label: 'Tailscale', icon: Share2, category: 'Estação' },
    { id: 'cache', label: 'Estação de Cache', icon: Database, category: 'Estação' },
    { id: 'revisao', label: 'Revisão', icon: Eye, category: 'Memória' },
    { id: 'jardim', label: 'Jardim', icon: Leaf, category: 'Memória' },
    { id: 'sedimentos', label: 'Sedimentos', icon: HelpCircle, category: 'Memória' },
    { id: 'stats', label: 'Métricas', icon: BarChart2, category: 'Análise' },
  ] as const;

  return (
    <div className={`app-bg flex flex-col font-sans select-none antialiased text-[#F7EFE7] ${activeTab === 'kaline' || activeTab === 'caverna' ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'}`} id="main-app-container"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-[#06070A]/72 backdrop-blur-xl border-b border-[#FF4C1F]/18 px-4 py-2 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Mobile hamburger menu button */}
          <button 
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="lg:hidden p-1.5 rounded-xl bg-[#10131A] text-[#A89F96] hover:text-[#FF4C1F] border border-[#252936] transition-colors"
            title="Menu de Navegação"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4.5 h-4.5" />}
          </button>

          <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden">
            <img 
              src="/brand/kaline-apple.png" 
              alt="Maçã de Cristal" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '🜂';
              }} 
            />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase text-[#F7EFE7] flex items-center gap-1.5 font-serif">
              K∧LINE 
              <button 
                onClick={() => setKalineVersion(v => v === 'V27' ? 'V27b' : 'V27')}
                className="text-[8px] sm:text-[9px] font-extrabold text-[#FF4C1F] bg-[#FF4C1F]/10 hover:bg-[#FF4C1F]/20 px-1 sm:px-1.5 py-0.5 rounded border border-[#FF4C1F]/20 transition-colors"
                title={`Alternar para ${kalineVersion === 'V27' ? 'V27b (Desktop)' : 'V27 (Mobile)'}`}
              >
                {kalineVersion.toLowerCase()}
              </button>
            </h1>
            <p className="text-[8px] text-[#A89F96] font-bold uppercase tracking-widest hidden sm:block">Fogo Central e Altar de Sincronização</p>
          </div>
        </div>

        {/* Header Badges & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
        </div>
      </header>

      {/* Main Content Layout with Sidebar for Desktop / Scroll Area for Mobile */}
      <div className={`grow min-h-0 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 relative ${activeTab === 'kaline' || activeTab === 'caverna' ? 'py-3 gap-3' : 'py-6 gap-6'}`}>
        
        {/* Mobile Sidebar Overlay Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Dynamic Sidebar Navigation Panel */}
        <aside className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto w-64 bg-[#06070A] lg:bg-[#0B0D12]/80 backdrop-blur-md border-r lg:border border-[#252936] p-4 flex flex-col gap-4 transition-transform duration-300 h-full lg:h-fit shrink-0 shadow-2xl lg:rounded-2xl lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex justify-between items-center lg:block pb-2 lg:pb-0">
            <div>
              <h2 className="text-lg font-bold tracking-tight font-serif text-[#F7EFE7]">K∧LINE</h2>
              <p className="text-[9px] text-[#A89F96] font-bold uppercase tracking-widest mt-0.5">Estação de Comando</p>
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-[#10131A] text-[#A89F96] hover:text-[#FF4C1F] border border-[#252936] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[75vh]">
            {['Centro', 'Estação', 'Forja', 'Memória'].map(category => (
              <div key={category} className="space-y-1">
                <h4 className="text-[9px] font-black text-[#A89F96] uppercase tracking-wider pl-2 pb-1 border-b border-[#252936]/40">{category}</h4>
                <div className="space-y-0.5 pt-1">
                  {tabs.filter(t => t.category === category).map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive 
                            ? 'bg-[#FF4C1F]/10 text-[#F7EFE7] border border-[#FF4C1F]/25 shadow-[inset_3px_0_0_#FF4C1F]' 
                            : 'text-[#A89F96] hover:text-[#F7EFE7] hover:bg-[#10131A] border border-transparent'
                        }`}
                        id={`sidebar-tab-${tab.id}`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF4C1F]' : 'text-[#A89F96]/70'}`} />
                        <span className="font-mono text-[11px] font-bold">├─ {tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#252936] text-[9px] text-[#A89F96] font-mono mt-auto">
            <p className="flex items-center gap-1">
              <CloudLightning className="w-3 h-3 text-[#FF4C1F]" />
              Tailnet: <strong className="text-[#F7EFE7]">100.82.124.43</strong>
            </p>
          </div>
        </aside>

        {/* Center Main Content Area */}
        <main className={`grow max-w-4xl w-full mx-auto flex flex-col min-w-0 ${activeTab === 'kaline' || activeTab === 'caverna' ? 'min-h-0 overflow-y-auto no-scrollbar pb-0 pt-0' : 'pb-20 lg:pb-10'}`}>
          {activeTab === 'today' && (
            <TodayDashboard presencaRegime={presencaRegime} setPresencaRegime={setPresencaRegime} 
              habits={habits} 
              onLogHabit={handleLogHabit} 
              dailyLog={dailyLog} 
              onSaveDailyLog={handleSaveDailyLog} 
            />
          )}
          {activeTab === 'stats' && <HabitStatsView habits={habits} />}
          {activeTab === 'monitor' && <DesktopMonitorView />}
          {activeTab === 'tailscale' && <TailscaleShareView />}
          {activeTab === 'cache' && <CacheDashboardView />}
          {activeTab === 'kaline' && <KalineChat />}
          {activeTab === 'caverna' && <CavernaEcoPanel />}
          {activeTab === 'guardiao' && <GuardiaoPanel />}
          {activeTab === 'perfil' && <PerfilPanel />}
          {activeTab === 'pritaneu' && <PritaneuPanel onNavigateTab={(tab) => setActiveTab(tab as TabType)} />}
          {activeTab === 'station' && <StationPanel />}
          {activeTab === 'station' && <HestiaStationPanel />}
          {activeTab === 'fala' && <ModoFalaPanel onClose={() => setActiveTab('kaline')} />}
          {activeTab === 'revisao' && <MemoryPanel subTab="revisao" />}
          {activeTab === 'jardim' && <MemoryPanel subTab="jardim" />}
          {activeTab === 'sedimentos' && <MemoryPanel subTab="sedimentos" />}
          {activeTab === 'agenda' && <AgendaPanel />}
          {activeTab === 'branding' && <BrandingPanel onClose={() => setActiveTab('kaline')} />}
        </main>
      </div>

      {/* PWA Intelligent Installation Prompt */}
      <InstallPrompt />

      
    </div>
  );
}
