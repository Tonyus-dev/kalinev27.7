const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

file = file.replace(/bg: '\$\{mt\.bg\}'/g, "bg: 'bg-[#FF4C1F]'");
file = file.replace(/bg10: '\$\{mt\.bg\}\/10'/g, "bg10: 'bg-[#FF4C1F]/10'");
file = file.replace(/bg15: '\$\{mt\.bg\}\/15'/g, "bg15: 'bg-[#FF4C1F]/15'");
file = file.replace(/bg5: '\$\{mt\.bg\}\/5'/g, "bg5: 'bg-[#FF4C1F]/5'");
file = file.replace(/hoverBg: 'hover:\$\{mt\.bg\}\/10'/g, "hoverBg: 'hover:bg-[#FF4C1F]/10'");

// remove duplicate fill
file = file.replace(/fill: 'fill-\[#E50914\]', from:/g, "from:");
file = file.replace(/fill: 'fill-\[#FF4C1F\]', from:/g, "from:");

fs.writeFileSync('src/components/KalineChat.tsx', file);
