const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

const targetStr = `
        {/* Main Chat Interface */}
        <div className="bg-[#0B0D12] rounded-[32px] border border-[#FF4C1F]/15 shadow-2xl flex flex-col flex-1 min-h-[400px] overflow-hidden relative">
          
          
          
          
          {/* Chat window viewport */}
          <div className="p-4 pb-[110px] sm:pb-[110px] overflow-y-auto grow space-y-5 no-scrollbar bg-gradient-to-b from-[#090A0D] to-[#040507]">
`;

// we will cut everything between Main Chat Interface div and Chat window viewport
const regex = /        \{\/\* Main Chat Interface \*\/\}\n        <div className="bg-\[#0B0D12\] rounded-\[32px\] border border-\[#FF4C1F\]\/15 shadow-2xl flex flex-col flex-1 min-h-\[400px\] overflow-hidden relative">[\s\S]*?          \{\/\* Chat window viewport \*\/\}\n          <div className="p-4 pb-\[110px\] sm:pb-\[110px\] overflow-y-auto grow space-y-5 no-scrollbar bg-gradient-to-b from-\[#090A0D\] to-\[#040507\]">/;

file = file.replace(regex, targetStr.trim());

fs.writeFileSync('src/components/KalineChat.tsx', file);
