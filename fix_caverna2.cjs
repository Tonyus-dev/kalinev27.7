const fs = require('fs');
let file = fs.readFileSync('src/components/CavernaEcoPanel.tsx', 'utf8');

const regex = /    } else {\n        if \(activeSession\) {[\s\S]*?  };\n    setActiveSession\(newSession\);[\s\S]*?    }\n  };/;
file = file.replace(regex, `    } else {
        if (activeSession) {
          const finalBlocks = activeSession.blocks.map(b => 
            b.status === 'current' ? { ...b, endTime: formatTime(recordingTime), status: 'processing' as BlockStatus } : b
          );
          const updated = { ...activeSession, status: 'finalizada' as const, blocks: finalBlocks };
          setActiveSession(updated);
          setSessions([updated, ...sessions]);
        }
    }
  };`);

fs.writeFileSync('src/components/CavernaEcoPanel.tsx', file);
