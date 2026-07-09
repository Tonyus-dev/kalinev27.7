const fs = require('fs');
let content = fs.readFileSync('src/components/ModoFalaPanel.tsx', 'utf8');

content = content.replace(
  '<div className={`w-8 h-8 rounded-full border ${t.primaryBorder30} flex items-center justify-center ${t.primaryBg10}`}>',
  '<div className={`w-8 h-8 rounded-full border ${t.primaryBorder30} flex items-center justify-center ${t.primaryBg10} overflow-hidden shadow-lg`}>'
);

content = content.replace(
  '<Volume2 className={`w-4 h-4 ${t.primaryClass}`} />',
  `<img src={\`/brand/\${activeMode}.png\`} alt={t.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'; }} />`
);

fs.writeFileSync('src/components/ModoFalaPanel.tsx', content);
