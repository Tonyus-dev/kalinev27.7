const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// We need to add touch handlers to the main div.
// First, add states for touchStart and touchEnd
const stateInjection = `
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      if (activeTab === 'today') setActiveTab('kaline');
      // optional: kaline -> caverna, etc.
    }
    if (isRightSwipe) {
      if (activeTab === 'kaline') setActiveTab('today');
    }
  };
`;

const tabsDef = "  const tabs = [";
const tabsIndex = content.indexOf(tabsDef);

if (tabsIndex !== -1) {
  content = content.substring(0, tabsIndex) + stateInjection + content.substring(tabsIndex);
}

// Next, add onTouchStart, onTouchMove, onTouchEnd to the main div
const mainDivStart = 'id="main-app-container"';
const newMainDivStart = 'id="main-app-container"\n      onTouchStart={onTouchStart}\n      onTouchMove={onTouchMove}\n      onTouchEnd={onTouchEnd}';

content = content.replace(mainDivStart, newMainDivStart);

fs.writeFileSync('src/App.tsx', content);
