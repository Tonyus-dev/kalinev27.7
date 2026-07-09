import { useState, useEffect } from 'react';
import { Share, Download, X, HelpCircle, CheckCircle } from 'lucide-react';

export default function InstallPrompt() {
  const [platform, setPlatform] = useState<'ios' | 'chrome' | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already standalone
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (navigator as any).standalone || 
      document.referrer.includes('android-app://');

    if (isStandalone) {
      return;
    }

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isIOS) {
      setPlatform('ios');
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        // Show after 2 seconds for smooth UX
        const timer = setTimeout(() => setIsVisible(true), 2500);
        return () => clearTimeout(timer);
      }
    }

    // Detect Chrome / Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform('chrome');
      
      const dismissed = localStorage.getItem('pwa-prompt-dismissed');
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleChromeInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:w-96 z-50 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-4 shadow-xl flex flex-col gap-3 transition-all duration-300 animate-pulse-slow">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            R
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Instalar "Controle de Rotina"</h3>
            <p className="text-xs text-slate-500">Adicionar à Tela de Início</p>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
          id="btn-close-pwa-prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {platform === 'ios' ? (
        <div className="text-xs text-slate-600 space-y-2">
          <p className="font-medium text-slate-700">Para instalar no seu iPhone ou iPad:</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Share className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>1. Toque no botão de <strong>Compartilhar</strong> no Safari (ícone de quadrado com seta para cima no rodapé).</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <Download className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>2. Role a lista para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center pt-1">Isso garante tela cheia PWA imersiva sem as barras de navegação do navegador.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-600">
            Aproveite a experiência de aplicativo nativo off-line com carregamento ultrarrápido e lembretes diários.
          </p>
          <div className="flex gap-2 pt-1">
            <button 
              onClick={handleDismiss} 
              className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs hover:bg-slate-200 transition-colors"
            >
              Agora Não
            </button>
            <button 
              onClick={handleChromeInstall} 
              className="flex-1 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Instalar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
