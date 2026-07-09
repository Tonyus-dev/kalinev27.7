const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf8');

file = file.replace(
  /const \[deviceMode, setDeviceMode\] = useState<'mobile' \| 'desktop'>\('mobile'\);/g,
  `const [kalineVersion, setKalineVersion] = useState<'V27' | 'V27b'>(() => {
    return (localStorage.getItem('kaline_version') as 'V27' | 'V27b') || 'V27';
  });

  useEffect(() => {
    localStorage.setItem('kaline_version', kalineVersion);
    window.dispatchEvent(new CustomEvent('kalineVersionChanged', { detail: kalineVersion }));
  }, [kalineVersion]);`
);

file = file.replace(
  /<span className="text-\[8px\] sm:text-\[9px\] font-extrabold text-\[#FF4C1F\] bg-\[#FF4C1F\]\/10 px-1 sm:px-1\.5 py-0\.5 rounded border border-\[#FF4C1F\]\/20">v27<\/span>/g,
  `<span className="text-[8px] sm:text-[9px] font-extrabold text-[#FF4C1F] bg-[#FF4C1F]/10 px-1 sm:px-1.5 py-0.5 rounded border border-[#FF4C1F]/20">{kalineVersion.toLowerCase()}</span>`
);

file = file.replace(
  /\{\/\* Device Indicator \*\/\}\s*<button\s*onClick=\{[^}]*\}\s*className="[^"]*"\s*title="[^"]*"\s*id="btn-toggle-device"\s*>[\s\S]*?<\/button>/g,
  `{/* Version Indicator */}
          <button 
            onClick={() => setKalineVersion(prev => prev === 'V27' ? 'V27b' : 'V27')}
            className="text-[9px] font-extrabold text-[#A89F96] bg-[#10131A] hover:bg-[#1C202E] px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg transition-all flex items-center gap-1 border border-[#252936] shrink-0"
            title="Alternar Versão (V27 Mobile / V27b Desktop)"
            id="btn-toggle-version"
          >
            {kalineVersion === 'V27' ? (
              <Smartphone className="w-3 h-3 text-[#FF4C1F] shrink-0" />
            ) : (
              <Laptop className="w-3 h-3 text-[#FF4C1F] shrink-0" />
            )}
          </button>`
);

fs.writeFileSync('src/App.tsx', file);
