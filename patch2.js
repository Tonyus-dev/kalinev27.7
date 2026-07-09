const fs = require('fs');
let file = fs.readFileSync('src/components/GuardiaoPanel.tsx', 'utf8');
const hookStr = `
  useEffect(() => { localStorage.setItem('kaline_openrouter_key', openRouterKey); }, [openRouterKey]);
  useEffect(() => { localStorage.setItem('kaline_gemini_key', geminiKey); }, [geminiKey]);
  useEffect(() => { localStorage.setItem('kaline_tavily_key', tavilyKey); }, [tavilyKey]);
`;
file = file.replace('  // Save changes to localStorage', hookStr + '\n  // Save changes to localStorage');
fs.writeFileSync('src/components/GuardiaoPanel.tsx', file);
