const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the TodayDashboard rendering in App.tsx
appContent = appContent.replace(
  '<TodayDashboard \n              habits={habits} \n              onLogHabit={handleLogHabit} \n              dailyLog={dailyLog} \n              onSaveDailyLog={handleSaveDailyLog} \n            />',
  '<TodayDashboard \n              habits={habits} \n              onLogHabit={handleLogHabit} \n              dailyLog={dailyLog} \n              onSaveDailyLog={handleSaveDailyLog} \n              presencaRegime={presencaRegime} \n              setPresencaRegime={setPresencaRegime} \n            />'
);

// We need to match the actual code in App.tsx for TodayDashboard rendering
