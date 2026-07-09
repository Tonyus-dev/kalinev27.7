const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// Update avatar span
file = file.replace(
  /<span className=\{\`hidden font-serif font-bold \$\{mt\.text\} text-xs\`\}>K<\/span>/g,
  "<span className={`hidden font-serif font-bold ${mt.text} text-xs`}>{mt.tagAvatar || mt.tagName.charAt(0)}</span>"
);

// Add tagAvatar to KLIO mt mapping
file = file.replace(
  /tagName: 'KLIO', tagImage: 'brand\/klio\.jpeg', shadow8:/g,
  "tagName: 'KLIO', tagAvatar: 'KL', tagImage: 'brand/klio.jpeg', shadow8:"
);

// Add tagAvatar to KALINE mt mapping
file = file.replace(
  /tagName: 'KALINE', tagImage: 'brand\/kaline\.jpeg', shadow8:/g,
  "tagName: 'KALINE', tagAvatar: 'K', tagImage: 'brand/kaline.jpeg', shadow8:"
);

// Add useEffect to change the first message
const useEffectToAdd = `
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && (prev[0].text.includes('Olá! Sou a Kaline') || prev[0].text.includes('Olá! Sou a Klio'))) {
        return [
          {
            sender: activeMode === 'kaline' ? 'kaline' : 'coder',
            text: activeMode === 'kaline' 
              ? 'Olá! Sou a Kaline. Meu canal de presença está pronto. Seus comandos passam pelo filtro do Qwen 1.5B e são moldados pelos contextos ativos de Identidade e Memória Relacional.'
              : 'Olá! Sou a Klio. Meu canal de programação está ativo. Seus comandos técnicos passam pelo filtro do Qwen 2.5 Coder, focados em excelência arquitetural e código nativo.',
            timestamp: prev[0].timestamp
          }
        ];
      }
      return prev;
    });
  }, [activeMode]);
`;

file = file.replace(
  /const discardSediment = \(id: string\) => \{/g,
  useEffectToAdd + "\n  const discardSediment = (id: string) => {"
);

fs.writeFileSync('src/components/KalineChat.tsx', file);
