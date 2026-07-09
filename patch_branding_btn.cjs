const fs = require('fs');
let code = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const search = `                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'sedimentos' }))}
                    className={\`\${t.text}/60 hover:\${t.text} hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer\`}
                    title="Consultar Sedimentação (Atalho)"
                    id="chat-input-sediment-shortcut"
                  >
                    <GitBranch className="w-4 h-4" />
                  </button>`;

const replace = `                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'sedimentos' }))}
                    className={\`\${t.text}/60 hover:\${t.text} hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer\`}
                    title="Consultar Sedimentação (Atalho)"
                    id="chat-input-sediment-shortcut"
                  >
                    <GitBranch className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('navigateTab', { detail: 'branding' }))}
                    className={\`\${t.text}/60 hover:\${t.text} hover:scale-110 active:scale-90 transition-all focus:outline-none cursor-pointer\`}
                    title="Branding K∧LINE"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                  </button>`;

code = code.replace(search, replace);
fs.writeFileSync('src/components/KalineChat.tsx', code);
console.log("Patched branding btn");
