const fs = require('fs');
let code = fs.readFileSync('src/components/ModoFalaPanel.tsx', 'utf8');

// 1. Add Settings and VoiceStyle
code = code.replace("import { X, Mic, Square, RotateCcw, Volume2, MessageSquare, Paperclip, Activity } from 'lucide-react';", 
"import { X, Mic, Square, RotateCcw, Volume2, MessageSquare, Paperclip, Activity, Settings } from 'lucide-react';");

code = code.replace("export type ActiveMode = 'kaline' | 'klio' | 'kharis';",
"export type ActiveMode = 'kaline' | 'klio' | 'kharis';\nexport type VoiceStyle = 'direta' | 'calorosa' | 'formal';");

// 2. Add isSettingsOpen and voiceStyle states
const searchState = `const [currentState, setCurrentState] = useState<KlioVoiceState>('idle');`;
const replaceState = `const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>(() => {
    return (localStorage.getItem('kaline_voice_style') as VoiceStyle) || 'direta';
  });

  useEffect(() => {
    localStorage.setItem('kaline_voice_style', voiceStyle);
  }, [voiceStyle]);

  const [currentState, setCurrentState] = useState<KlioVoiceState>('idle');`;
code = code.replace(searchState, replaceState);

// 3. Update replayMessage pitch calculation
const searchPitch = `    utterance.pitch = activeMode === 'klio' ? 0.9 : activeMode === 'kharis' ? 1.0 : 1.1;`;
const replacePitch = `    let basePitch = activeMode === 'klio' ? 0.9 : activeMode === 'kharis' ? 1.0 : 1.1;
    if (voiceStyle === 'formal') {
      utterance.pitch = Math.max(0.1, basePitch - 0.2);
      utterance.rate = 0.9;
    } else if (voiceStyle === 'calorosa') {
      utterance.pitch = Math.min(2.0, basePitch + 0.15);
      utterance.rate = 0.95;
    } else {
      utterance.pitch = basePitch;
      utterance.rate = 1.05;
    }`;
code = code.replace(searchPitch, replacePitch);

// 4. Update Header Buttons
const searchHeader = `        <button 
          onClick={onClose}
          className="p-2 text-[#A89F96] hover:text-[#F7EFE7] hover:bg-[#252936] rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>`;
const replaceHeader = `        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-[#A89F96] hover:text-[#F7EFE7] hover:bg-[#252936] rounded-xl transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 text-[#A89F96] hover:text-[#F7EFE7] hover:bg-[#252936] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>`;
code = code.replace(searchHeader, replaceHeader);

fs.writeFileSync('src/components/ModoFalaPanel.tsx', code);
console.log("Updated ModoFalaPanel");
