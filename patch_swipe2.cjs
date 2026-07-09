const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;
    
    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;
    
    // Check if the swipe is mostly horizontal
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;

      if (isLeftSwipe) {
        if (activeTab === 'today') setActiveTab('kaline');
      }
      if (isRightSwipe) {
        if (activeTab === 'kaline') setActiveTab('today');
      }
    }
  };
`;

const statePattern = /const \[touchStart, setTouchStart\] = useState.*?const onTouchEnd = \(\) => \{.*?\};/s;
content = content.replace(statePattern, replacement.trim());

fs.writeFileSync('src/App.tsx', content);
