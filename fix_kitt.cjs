const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

file = file.replace(
  /import React, \{ useState, useRef, useEffect \} from 'react';/,
  "import React, { useState, useRef, useEffect } from 'react';\nimport KittScanner, { KittState } from './KittScanner';"
);

// We need to determine kittState
const kittStateLogic = `
  const getKittState = (): KittState => {
    if (isListening) return "listening";
    if (loading && pipelineStep === 'filtering') return "radar";
    if (loading && pipelineStep === 'generating') return "thinking";
    return "idle";
  };
`;

// Insert getKittState inside the component
file = file.replace(
  /const handleSend = async \(\) => \{/,
  `${kittStateLogic}\n  const handleSend = async () => {`
);

// Replace the old progress meter
file = file.replace(
  /\{\/\* Segmented Horizontal Progress Meter faithful to the screenshot \*\/\}[\s\S]*?<\/div>/,
  `{/* KITT Scanner */}
            <div className="flex justify-center items-center py-2 px-4 select-none bg-[#090A0D]/95">
              <KittScanner 
                state={getKittState()}
                variant={activeMode === 'coder' ? 'ember' : 'ruby'}
                className="w-48 max-w-full"
                height={16}
                segments={8}
              />
            </div>`
);

fs.writeFileSync('src/components/KalineChat.tsx', file);
