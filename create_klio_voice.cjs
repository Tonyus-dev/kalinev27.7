const fs = require('fs');

const code = `import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';

export type KlioVoiceState = 'idle' | 'recording' | 'transcribing' | 'thinking' | 'speaking' | 'done' | 'error';

interface Message {
  id: string;
  sender: 'me' | 'klio';
  text: string;
}

export default function ModoFalaKlio({ onClose }: { onClose: () => void }) {
  const [currentState, setCurrentState] = useState<KlioVoiceState>('idle');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showChip, setShowChip] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const historyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const STATES = {
    idle:        { text:'Toque e fale',        badge:'🎙️', label:'Falar' },
    recording:   { text:'Estou ouvindo',       badge:'⏹',  label:'Enviar fala' },
    transcribing:{ text:'Escrevendo sua fala', badge:'⏳', label:'Escrevendo' },
    thinking:    { text:'Pensando',            badge:'…',  label:'Pensando' },
    speaking:    { text:'Falando',             badge:'🔊', label:'Falando' },
    done:        { text:'Pode falar de novo',  badge:'🎙️', label:'Falar de novo' },
    error:       { text:'Tente de novo',       badge:'↻',  label:'Tentar de novo' }
  };

  const cfg = STATES[currentState];

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, isDrawerOpen]);

  const runFlow = () => {
    setCurrentState('transcribing');
    setTimeout(() => {
      setCurrentState('thinking');
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'me', text: 'Você falou: Me ajuda com a tarefa.' }]);
        setTimeout(() => {
          setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'klio', text: 'Claro. Vou te ajudar com calma, passo por passo.' }]);
          setCurrentState('speaking');
          setTimeout(() => {
            setCurrentState('done');
          }, 3000);
        }, 520);
      }, 950);
    }, 780);
  };

  const handleMicClick = () => {
    if (['idle', 'done', 'error'].includes(currentState)) {
      setCurrentState('recording');
    } else if (currentState === 'recording') {
      runFlow();
    }
  };

  const handleReplay = () => {
    setCurrentState('speaking');
    setTimeout(() => setCurrentState('done'), 2800);
  };

  const handleStop = () => {
    setCurrentState('done');
  };

  const handleSendText = () => {
    const v = inputValue.trim();
    if (!v) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'me', text: v }]);
    setInputValue('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'klio', text: 'Entendi. Vou te ajudar.' }]);
    }, 650);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setShowChip(true);
      setTimeout(() => setShowChip(false), 2100);
      e.target.value = '';
    }
  };

  // Keyboard shortcuts matching the HTML
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
        return;
      }
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      const k = e.key.toLowerCase();
      if (k === 'c') setIsDrawerOpen(p => !p);
      else if (k === 't') fileInputRef.current?.click();
      else if (k === 'r') handleReplay();
      else if (k === 's') handleStop();
      else if (k === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleMicClick();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="klio-voice-wrapper" data-state={currentState}>
      <style>{css}</style>
      
      <div className={\`chip \${showChip ? 'show' : ''}\`}>Tarefa recebida</div>

      <main className="voice-shell" aria-label="Modo de fala da Klio">
        <section className="topbar w-full" aria-label="Estado atual">
          {/* Opcional: botão de fechar para voltar ao chat se renderizado via modal/tab */}
          <div className="state-pill ml-auto" aria-live="polite" aria-atomic="true">
            <p id="statusText">{cfg.text}</p>
            <span className="state-dot" aria-hidden="true"></span>
          </div>
        </section>

        <section className="main-action-area">
          <div className="avatar-trigger-wrap">
            <div className="avatar-halo" aria-hidden="true"></div>
            <div className="wave-rings" aria-hidden="true">
              <span className="ring"></span>
              <span className="ring"></span>
              <span className="ring"></span>
            </div>
            
            <button 
              id="mainVoiceButton" 
              aria-label={cfg.label} 
              title={cfg.label} 
              type="button"
              onClick={handleMicClick}
            >
              <span className="sr-only" id="mainText">{cfg.label}</span>
              <div className={\`avatar-disc \${imageLoaded ? 'has-image' : ''}\`} aria-hidden="true">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                  alt="" 
                  draggable="false" 
                  className={imageLoaded ? 'loaded' : ''}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="avatar-placeholder">🙂</div>
              </div>
              <span className="record-badge" aria-hidden="true">
                <span>{cfg.badge}</span>
              </span>
            </button>
            
            <div className="eq" aria-hidden="true">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>
        </section>

        <section className="audio-controls" aria-label="Controles de áudio">
          <button className="icon-button" onClick={handleReplay} aria-label="Ouvir de novo" title="Ouvir de novo" type="button">
            <span className="button-symbol" aria-hidden="true">🔊</span>
          </button>
          <button className="icon-button" onClick={handleStop} aria-label="Parar" title="Parar" type="button">
            <span className="button-symbol" aria-hidden="true">⏹</span>
          </button>
        </section>

        <div className="soft-divider" aria-hidden="true"></div>

        <section className="bottom-actions" aria-label="Ações secundárias">
          <button 
            className="icon-button" 
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Abrir chat" 
            aria-expanded={isDrawerOpen} 
            title="Chat" 
            type="button"
          >
            <span className="button-symbol" aria-hidden="true">💬</span>
          </button>
          <button 
            className="icon-button" 
            onClick={() => fileInputRef.current?.click()}
            aria-label="Enviar tarefa" 
            title="Tarefa" 
            type="button"
          >
            <span className="button-symbol" aria-hidden="true">📎</span>
          </button>
        </section>
      </main>

      <input 
        type="file" 
        ref={fileInputRef}
        className="file-hidden" 
        accept="image/*,.pdf,.txt,.docx" 
        aria-label="Selecionar tarefa"
        onChange={handleFileChange}
      />

      <div className={\`drawer-backdrop \${isDrawerOpen ? 'open' : ''}\`} onClick={() => setIsDrawerOpen(false)}></div>
      <div className={\`drawer \${isDrawerOpen ? 'open' : ''}\`} role="dialog" aria-label="Chat" aria-modal="true">
        <div className="drawer-handle" aria-hidden="true"></div>
        <div className="drawer-head">
          <span className="drawer-title">Chat</span>
          <button className="close-btn" onClick={() => setIsDrawerOpen(false)} aria-label="Fechar chat" title="Fechar" type="button">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="history" ref={historyRef} aria-live="polite">
          {messages.map(m => (
            <div key={m.id} className={\`bubble \${m.sender === 'me' ? 'me' : 'klio'}\`}>
              {m.text}
            </div>
          ))}
        </div>
        <div className="composer">
          <textarea 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
              }
            }}
            placeholder="Escreva uma mensagem..." 
            rows={1}
          />
          <button className="send-btn" onClick={handleSendText} aria-label="Enviar mensagem" title="Enviar" type="button">›</button>
        </div>
      </div>
    </div>
  );
}

const css = \`
  .klio-voice-wrapper {
    --bg:#08080e;
    --panel:rgba(255,255,255,0.065);
    --panel-strong:rgba(255,255,255,0.115);
    --line:rgba(255,255,255,0.10);
    --ivory:#f7efe4;
    --muted:rgba(247,239,228,0.64);
    --kaline:#c98a65;
    --rose:#be185d;
    --danger:#ef4444;
    --ok:#22c55e;
    
    position: relative;
    width: 100%;
    height: 100%;
    flex: 1;
    border-radius: 24px;
    background: var(--bg);
    color: var(--ivory);
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    overflow: hidden;
    
    background:
      radial-gradient(circle at 50% 44%, rgba(201,138,101,0.20), transparent 34%),
      radial-gradient(circle at 70% 84%, rgba(190,24,93,0.17), transparent 44%),
      radial-gradient(circle at 15% 12%, rgba(255,255,255,0.03), transparent 26%),
      var(--bg);
  }

  .klio-voice-wrapper::before {
    content:"";position:absolute;inset:0;pointer-events:none;
    background:
      linear-gradient(180deg, rgba(0,0,0,.24), transparent 20%, transparent 76%, rgba(0,0,0,.48)),
      repeating-linear-gradient(90deg, rgba(255,255,255,.014) 0 1px, transparent 1px 90px);
    mix-blend-mode:screen;opacity:.36;
    border-radius: 24px;
  }

  .klio-voice-wrapper button, .klio-voice-wrapper input, .klio-voice-wrapper textarea {font:inherit}
  .klio-voice-wrapper button {border:0}
  .klio-voice-wrapper .sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}

  .voice-shell{
    position:relative;z-index:1;width:100%;height:100%;min-height:520px;
    display:flex;flex-direction:column;padding:14px 20px calc(14px + env(safe-area-inset-bottom));gap:14px;isolation:isolate;
  }

  .topbar{
    position:relative;z-index:3;min-height:48px;display:flex;align-items:flex-start;flex:0 0 auto;
  }
  .state-pill{
    width:min(44vw,180px);min-height:42px;display:flex;align-items:center;justify-content:flex-end;gap:8px;
    padding:8px 10px 8px 12px;border-radius:999px;background:rgba(255,255,255,.07);
    border:1px solid rgba(255,255,255,.10);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
    box-shadow:0 14px 44px rgba(0,0,0,.22);
  }
  .state-dot{flex:0 0 auto;width:9px;height:9px;border-radius:999px;background:var(--kaline);box-shadow:0 0 18px rgba(201,138,101,.7)}
  #statusText{margin:0;font-size:clamp(12px,3.25vw,14px);line-height:1.15;font-weight:720;letter-spacing:-.14px;text-align:right;transition:opacity .16s ease, transform .16s ease}
  #statusText.dim{opacity:.46;transform:translateY(1px)}

  .klio-voice-wrapper[data-state="recording"] .state-dot{background:var(--danger);box-shadow:0 0 18px rgba(239,68,68,.76);animation:dotPulse 1s ease-in-out infinite}
  .klio-voice-wrapper[data-state="transcribing"] .state-dot, .klio-voice-wrapper[data-state="thinking"] .state-dot{background:var(--rose);box-shadow:0 0 18px rgba(190,24,93,.72)}
  .klio-voice-wrapper[data-state="speaking"] .state-dot{background:var(--ok);box-shadow:0 0 18px rgba(34,197,94,.7);animation:dotPulse 1.25s ease-in-out infinite}
  .klio-voice-wrapper[data-state="error"] .state-dot{background:var(--danger);box-shadow:0 0 18px rgba(239,68,68,.8)}
  
  @keyframes dotPulse{50%{transform:scale(1.42);opacity:.72}}

  .main-action-area{
    position:relative;z-index:2;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;
  }
  .avatar-trigger-wrap{position:relative;display:flex;align-items:center;justify-content:center}
  .avatar-halo{
    position:absolute;width:280px;height:280px;border-radius:999px;
    background:radial-gradient(circle, rgba(201,138,101,.26), transparent 62%);
    filter:blur(12px);opacity:.88;transition:opacity .22s ease, transform .22s ease, background .22s ease;pointer-events:none;
  }
  #mainVoiceButton{
    position:relative;z-index:2;width:min(58vw,230px);height:min(58vw,230px);max-width:230px;max-height:230px;min-width:160px;min-height:160px;
    border-radius:999px;background:transparent;color:var(--ivory);display:grid;place-items:center;cursor:pointer;user-select:none;
    transition:transform .12s ease, filter .22s ease;overflow:visible;
  }
  #mainVoiceButton:active{transform:scale(.97)}
  .avatar-disc{
    position:relative;width:100%;height:100%;border-radius:999px;overflow:hidden;
    border:1px solid rgba(247,239,228,.18);
    background:
      radial-gradient(circle at 34% 24%, rgba(255,255,255,.14), transparent 42%),
      linear-gradient(145deg, rgba(201,138,101,.32), rgba(190,24,93,.20));
    box-shadow:0 22px 72px rgba(201,138,101,.18), inset 0 0 34px rgba(255,255,255,.04);
  }
  .avatar-disc img{width:100%;height:100%;object-fit:cover;display:block;opacity:0;transition:opacity .25s ease;user-select:none;-webkit-user-drag:none}
  .avatar-disc img.loaded{opacity:1}
  .avatar-placeholder{position:absolute;inset:0;display:grid;place-items:center;font-size:64px;opacity:.92}
  .avatar-disc.has-image .avatar-placeholder{display:none}

  .record-badge{
    position:absolute;right:4px;bottom:6px;z-index:5;
    width:54px;height:54px;border-radius:999px;display:grid;place-items:center;
    background:rgba(10,10,18,.92);border:1px solid rgba(247,239,228,.18);
    box-shadow:0 12px 34px rgba(0,0,0,.44), inset 0 0 18px rgba(255,255,255,.04);
    transition:transform .18s ease, background .18s ease, box-shadow .18s ease;
  }
  .record-badge span{font-size:26px;line-height:1;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}

  .wave-rings{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;opacity:0;transition:opacity .22s ease}
  .wave-rings .ring{position:absolute;width:min(58vw,230px);height:min(58vw,230px);max-width:230px;max-height:230px;min-width:160px;min-height:160px;border-radius:999px;border:2px solid rgba(201,138,101,.5);opacity:0}
  .klio-voice-wrapper[data-state="recording"] .wave-rings, .klio-voice-wrapper[data-state="speaking"] .wave-rings{opacity:1}
  .klio-voice-wrapper[data-state="recording"] .wave-rings .ring{border-color:rgba(239,68,68,.55);animation:wave 1.7s ease-out infinite}
  .klio-voice-wrapper[data-state="speaking"] .wave-rings .ring{border-color:rgba(201,138,101,.55);animation:wave 2.05s ease-out infinite}
  .wave-rings .ring:nth-child(2){animation-delay:.42s}.wave-rings .ring:nth-child(3){animation-delay:.84s}
  
  @keyframes wave{0%{transform:scale(1);opacity:.62}100%{transform:scale(1.85);opacity:0}}

  .eq{position:absolute;bottom:-24px;left:50%;transform:translateX(-50%);display:flex;align-items:flex-end;gap:4px;height:20px;opacity:0;transition:opacity .22s ease;pointer-events:none}
  .klio-voice-wrapper[data-state="speaking"] .eq, .klio-voice-wrapper[data-state="recording"] .eq{opacity:1}
  .eq span{width:4px;height:6px;border-radius:999px;background:linear-gradient(180deg,var(--kaline),var(--rose));animation:eq 1s ease-in-out infinite}
  .klio-voice-wrapper[data-state="recording"] .eq span{background:linear-gradient(180deg,#ef4444,var(--rose))}
  .eq span:nth-child(2){animation-delay:.1s}.eq span:nth-child(3){animation-delay:.2s}.eq span:nth-child(4){animation-delay:.3s}.eq span:nth-child(5){animation-delay:.18s}
  @keyframes eq{50%{height:20px}}

  .klio-voice-wrapper[data-state="recording"] .avatar-halo{background:radial-gradient(circle, rgba(239,68,68,.38), transparent 62%);animation:halo 1.55s ease-in-out infinite}
  .klio-voice-wrapper[data-state="recording"] .record-badge{background:rgba(68,12,18,.94);box-shadow:0 12px 34px rgba(239,68,68,.24), inset 0 0 18px rgba(255,255,255,.06)}
  .klio-voice-wrapper[data-state="speaking"] .avatar-halo{background:radial-gradient(circle, rgba(201,138,101,.42), transparent 62%);animation:halo 1.9s ease-in-out infinite}
  .klio-voice-wrapper[data-state="thinking"] .avatar-disc, .klio-voice-wrapper[data-state="transcribing"] .avatar-disc{box-shadow:0 22px 82px rgba(190,24,93,.34), inset 0 0 36px rgba(255,255,255,.06)}
  .klio-voice-wrapper[data-state="thinking"] .avatar-disc img, .klio-voice-wrapper[data-state="transcribing"] .avatar-disc img{animation:softGlow 1.4s ease-in-out infinite}
  @keyframes halo{50%{transform:scale(1.12);opacity:1}}
  @keyframes softGlow{50%{filter:brightness(1.08) saturate(1.08)}}

  .audio-controls, .bottom-actions {
    position:relative;z-index:3;display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%;max-width:520px;margin:0 auto;
  }
  .icon-button{height:64px;border-radius:23px;background:var(--panel);border:1px solid rgba(255,255,255,.092);color:var(--ivory);backdrop-filter:blur(13px);-webkit-backdrop-filter:blur(13px);display:grid;place-items:center;cursor:pointer;box-shadow:inset 0 0 28px rgba(255,255,255,.025),0 16px 42px rgba(0,0,0,.18);transition:transform .12s ease, background .18s ease, border-color .18s ease}
  .icon-button:active{transform:scale(.965)} .icon-button:hover{background:var(--panel-strong);border-color:rgba(255,255,255,.14)}
  .button-symbol{font-size:34px;line-height:1;filter:drop-shadow(0 8px 12px rgba(0,0,0,.32))}
  .soft-divider{position:relative;z-index:3;height:1px;width:100%;max-width:520px;margin:0 auto;background:linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent)}
  .klio-voice-wrapper button:focus{outline:none}
  .klio-voice-wrapper button:focus-visible, .klio-voice-wrapper textarea:focus-visible{outline:2px solid var(--kaline);outline-offset:3px;box-shadow:0 0 0 4px rgba(201,138,101,.25)}
  #mainVoiceButton:focus-visible{outline-offset:8px;box-shadow:0 0 0 6px rgba(201,138,101,.28)}

  .chip{position:absolute;left:50%;top:calc(14px + env(safe-area-inset-top));transform:translate(-50%,-16px);z-index:80;padding:9px 16px;border-radius:999px;background:rgba(34,197,94,.18);border:1px solid rgba(34,197,94,.42);color:#bbf7d0;font-size:13px;font-weight:700;opacity:0;transition:opacity .25s ease, transform .25s ease;backdrop-filter:blur(10px)}
  .chip.show{opacity:1;transform:translate(-50%,0)}

  .drawer-backdrop{position:absolute;inset:0;z-index:40;background:rgba(0,0,0,.52);opacity:0;pointer-events:none;transition:opacity .22s ease; border-radius: 24px;}
  .drawer-backdrop.open{opacity:1;pointer-events:auto}
  .drawer{position:absolute;left:0;right:0;bottom:0;z-index:50;max-height:84svh;display:flex;flex-direction:column;gap:10px;padding:12px 16px calc(16px + env(safe-area-inset-bottom));background:rgba(18,18,26,.96);border-top:1px solid rgba(255,255,255,.10);border-radius:24px 24px;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transform:translateY(100%);transition:transform .25s ease}
  .drawer.open{transform:translateY(0)}
  .drawer-handle{width:44px;height:5px;margin:0 auto 2px;border-radius:99px;background:rgba(255,255,255,.20)}
  .drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
  .drawer-title{font-size:13px;font-weight:700;color:var(--muted)}
  .close-btn{width:42px;height:42px;display:grid;place-items:center;border-radius:14px;background:var(--panel);color:var(--ivory);cursor:pointer}
  .history{flex:1;min-height:126px;max-height:48svh;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:6px 0}
  .bubble{max-width:80%;padding:12px 14px;border-radius:18px;font-size:15px;line-height:1.35;word-break:break-word}
  .bubble.me{align-self:flex-end;background:linear-gradient(135deg,#c98a65,#be185d);color:#fff;border-bottom-right-radius:6px}
  .bubble.klio{align-self:flex-start;background:var(--panel-strong);border:1px solid rgba(255,255,255,.07);color:var(--ivory);border-bottom-left-radius:6px}
  .composer{display:flex;gap:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.07)}
  .composer textarea{flex:1;min-height:46px;max-height:116px;resize:none;padding:12px 14px;border-radius:15px;background:var(--panel);border:1px solid rgba(255,255,255,.09);color:var(--ivory);outline:none;font-size:15px}
  .send-btn{width:52px;min-width:52px;height:48px;border-radius:15px;background:linear-gradient(135deg,#c98a65,#be185d);color:#fff;font-size:32px;font-weight:800;cursor:pointer}
  .file-hidden{position:absolute;width:0;height:0;opacity:0;pointer-events:none}

  @media (max-width:380px){
    .voice-shell{padding-left:16px;padding-right:16px;gap:10px}
    .state-pill{width:min(46vw,156px);min-height:38px;padding:7px 9px 7px 10px}
    #statusText{font-size:12px}
    .icon-button{height:58px;border-radius:20px}.button-symbol{font-size:31px}
    .record-badge{width:48px;height:48px}
    .record-badge span{font-size:22px}
  }
  @media (max-height:700px){
    .voice-shell{min-height:0;padding-top:8px;gap:9px}
    #mainVoiceButton{width:min(50vw,190px);height:min(50vw,190px);min-width:142px;min-height:142px}
    .avatar-halo{width:238px;height:238px}
    .wave-rings .ring{width:min(50vw,190px);height:min(50vw,190px);min-width:142px;min-height:142px}
    .record-badge{width:46px;height:46px}
    .record-badge span{font-size:22px}
    .icon-button{height:52px;border-radius:18px}.button-symbol{font-size:29px}
    .eq{bottom:-21px;height:18px}
  }
\`;
`;

fs.writeFileSync('src/components/ModoFalaKlio.tsx', code);

// Inject into App.tsx
let appFile = fs.readFileSync('src/App.tsx', 'utf8');

if (!appFile.includes('ModoFalaKlio')) {
  appFile = appFile.replace(
    /import HestiaStationPanel from '.\/components\/HestiaStationPanel';/,
    "import HestiaStationPanel from './components/HestiaStationPanel';\nimport ModoFalaKlio from './components/ModoFalaKlio';\nimport { Mic } from 'lucide-react';"
  );

  appFile = appFile.replace(
    /\{ id: 'caverna', label: 'Caverna', icon: Cpu, category: 'Main' \},/,
    "{ id: 'caverna', label: 'Caverna', icon: Cpu, category: 'Main' },\n    { id: 'fala', label: 'Modo Fala', icon: Mic, category: 'Main' },"
  );

  appFile = appFile.replace(
    /\{activeTab === 'station' && <HestiaStationPanel \/>\}/,
    "{activeTab === 'station' && <HestiaStationPanel />}\n          {activeTab === 'fala' && <ModoFalaKlio onClose={() => setActiveTab('kaline')} />}"
  );

  fs.writeFileSync('src/App.tsx', appFile);
}

console.log('ModoFalaKlio criado e injetado com sucesso.');
