const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const modalStart = '{/* Semaphore Modal Overlay */}';
const startIndex = content.indexOf(modalStart);

if (startIndex !== -1) {
  // Let's find the closing of this JSX block
  const searchStr = '      )}';
  const endIndex = content.indexOf(searchStr, startIndex);
  if (endIndex !== -1) {
    content = content.substring(0, startIndex) + content.substring(endIndex + searchStr.length);
    fs.writeFileSync('src/App.tsx', content);
    console.log("Modal removed successfully");
  } else {
    console.log("End index not found");
  }
} else {
  console.log("Start index not found");
}
