export interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'morning' | 'afternoon' | 'night' | 'all';
  frequency: 'daily' | 'weekly' | 'custom';
  customDays?: number[]; // 0 for Sunday, 1 for Monday, etc.
  targetValue: number; // e.g., 1 for checklist, 8 for glasses of water
  unit: string; // e.g., 'vez', 'copos', 'ml', 'min', 'km'
  color: string; // Tailwind color class (e.g. 'indigo', 'rose', 'emerald', 'amber', 'sky', 'violet')
  icon: string; // Lucide icon name
  createdAt: string;
  history: Record<string, number>; // Maps YYYY-MM-DD to completed value
  streak: number;
  maxStreak: number;
}

export type MoodType = 'great' | 'good' | 'neutral' | 'tired' | 'stressed' | null;

export interface DailyLog {
  date: string; // YYYY-MM-DD
  mood: MoodType;
  reflection: string;
}

export interface PRStep {
  title: string;
  description: string;
  scope: string[];
  codeSnippetTitle?: string;
  codeSnippet?: string;
  branchName: string;
  status: 'pending' | 'completed' | 'current';
}
