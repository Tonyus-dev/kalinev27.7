const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Remove showSemaphoreModal useState
appContent = appContent.replace(
  "const [showSemaphoreModal, setShowSemaphoreModal] = useState<boolean>(false);",
  ""
);

// Remove the modal JSX block
const startIdx = appContent.indexOf('{/* Semaphore Modal Overlay */}');
if (startIdx !== -1) {
  const endStr = '  );';
  const endIdx = appContent.indexOf(endStr, startIdx);
  if (endIdx !== -1) {
    appContent = appContent.substring(0, startIdx) + appContent.substring(endIdx);
  }
}

// Remove the button that opens it, if present
// Let's find it.
