const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const kittStateLogic = `
  const getKittState = (): KittState => {
    if (isListening) return "listening";
    if (loading && pipelineStep === 'filtering') return "radar";
    if (loading && pipelineStep === 'generating') return "thinking";
    return "idle";
  };
`;

file = file.replace(
  /const handleSend = \(\) => \{/,
  `${kittStateLogic}\n  const handleSend = () => {`
);

fs.writeFileSync('src/components/KalineChat.tsx', file);
