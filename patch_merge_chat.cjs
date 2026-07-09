const fs = require('fs');
let file = fs.readFileSync('src/components/KalineChat.tsx', 'utf8');

// 1. Remove coderMessages state
file = file.replace(/const \[coderMessages, setCoderMessages\] = useState<Message\[\]>\(\[[\s\S]*?\]\);\n/, '');

// 2. Replace conditional setting with just setting messages
file = file.replace(/if \(activeMode === 'kaline'\) \{\n\s*setMessages\(prev => \[\.\.\.prev, fileMsg\]\);\n\s*\} else \{\n\s*setCoderMessages\(prev => \[\.\.\.prev, fileMsg\]\);\n\s*\}/g, "setMessages(prev => [...prev, fileMsg]);");

file = file.replace(/if \(activeMode === 'kaline'\) \{\n\s*setMessages\(prev => \[\.\.\.prev, reply\]\);\n\s*\} else \{\n\s*setCoderMessages\(prev => \[\.\.\.prev, reply\]\);\n\s*\}/g, "setMessages(prev => [...prev, reply]);");

file = file.replace(/if \(activeMode === 'kaline'\) \{\n\s*setMessages\(prev => \[\.\.\.prev, errMsg\]\);\n\s*\} else \{\n\s*setCoderMessages\(prev => \[\.\.\.prev, errMsg\]\);\n\s*\}/g, "setMessages(prev => [...prev, errMsg]);");

// 3. handleSend
file = file.replace(/if \(activeMode === 'kaline'\) \{\n\s*setMessages\(prev => \[\.\.\.prev, userMsg\]\);\n\s*setInput\(''\);\n\s*processMessage\(userMsg.text\);\n\s*\} else \{\n\s*setCoderMessages\(prev => \[\.\.\.prev, userMsg\]\);\n\s*setInput\(''\);\n\s*processCoderMessage\(userMsg.text\);\n\s*\}/g, 
  "setMessages(prev => [...prev, userMsg]);\n      setInput('');\n      if (activeMode === 'kaline') {\n        processMessage(userMsg.text);\n      } else {\n        processCoderMessage(userMsg.text);\n      }");

// 4. processCoderMessage appending response
file = file.replace(/setCoderMessages\(prev => \[/g, "setMessages(prev => [");

// 5. The map loop
file = file.replace(/\(activeMode === 'kaline' \? messages : coderMessages\)\.map/g, "messages.map");

// 6. Fix the useEffect that scrolls
file = file.replace(/, coderMessages, activeMode/g, ", activeMode");

fs.writeFileSync('src/components/KalineChat.tsx', file);
