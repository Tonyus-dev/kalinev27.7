const fs = require('fs');
let file = fs.readFileSync('src/components/GuardiaoPanel.tsx', 'utf8');

file = file.replace(
  '  const [openRouterKey, setOpenRouterKey] = useState(() => localStorage.getItem("kaline_openrouter_key") || "");\n  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("kaline_gemini_key") || "");\n  const [tavilyKey, setTavilyKey] = useState(() => localStorage.getItem("kaline_tavily_key") || "");\n  const PRESET_AVATARS = [\n    return stored ? JSON.parse(stored) : {',
  '    const stored = localStorage.getItem("kaline_thread_summary");\n    return stored ? JSON.parse(stored) : {'
);

file = file.replace(
  '  // Quick Preset Avatars',
  '  const [openRouterKey, setOpenRouterKey] = useState(() => localStorage.getItem("kaline_openrouter_key") || "");\n  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("kaline_gemini_key") || "");\n  const [tavilyKey, setTavilyKey] = useState(() => localStorage.getItem("kaline_tavily_key") || "");\n\n  // Quick Preset Avatars'
);

fs.writeFileSync('src/components/GuardiaoPanel.tsx', file);
