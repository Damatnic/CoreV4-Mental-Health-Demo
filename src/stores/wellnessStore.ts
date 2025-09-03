import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MoodEntry {
  id: string;
  mood: number; // 1-10 scale
  notes?: string;
  timestamp: Date;
  tags?: string[];
}

export interface WellnessGoal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string; // 'days', 'hours', 'times', etc.
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
}

export interface WellnessState {
  // Mood tracking
  moodEntries: MoodEntry[];
  currentMood: number;
  
  // Goals
  wellnessGoals: WellnessGoal[];
  
  // Actions
  addMoodEntry: (mood: number, notes?: string, tags?: string[]) => void;
  updateCurrentMood: (mood: number) => void;
  addWellnessGoal: (goal: Omit<WellnessGoal, 'id' | 'createdAt' | 'completed' | 'currentValue'>) => void;
  updateGoalProgress: (goalId: string, newValue: number) => void;
  completeGoal: (goalId: string) => void;
  
  // Analytics
  getMoodAverage: (days?: number) => number;
  getMoodTrend: () => 'improving' | 'declining' | 'stable';
  getCompletedGoalsCount: () => number;
}

export const useWellnessStore = create<WellnessState>()(
  persist(
    (set, get) => ({
      // Initial state
      moodEntries: [],
      currentMood: 5,
      wellnessGoals: [],

      // Actions
      addMoodEntry: (mood: number, notes?: string, tags?: string[]) => {
        const entry: MoodEntry = {
          id: crypto.randomUUID(),
          mood,
          notes,
          timestamp: new Date(),
          tags
        };

        set(state => ({
          moodEntries: [entry, ...state.moodEntries].slice(0, 100), // Keep last 100 entries
          currentMood: mood
        }));
      },

      updateCurrentMood: (mood: number) => {
        set({ currentMood: mood });
      },

      addWellnessGoal: (goalData) => {
        const goal: WellnessGoal = {
          ...goalData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          completed: false,
          currentValue: 0
        };

        set(state => ({
          wellnessGoals: [...state.wellnessGoals, goal]
        }));
      },

      updateGoalProgress: (goalId: string, newValue: number) => {
        set(state => ({
          wellnessGoals: state.wellnessGoals.map(goal =>
            goal.id === goalId 
              ? { 
                  ...goal, 
                  currentValue: newValue,
                  completed: newValue >= goal.targetValue
                }
              : goal
          )
        }));
      },

      completeGoal: (goalId: string) => {
        set(state => ({
          wellnessGoals: state.wellnessGoals.map(goal =>
            goal.id === goalId ? { ...goal, completed: true } : goal
          )
        }));
      },

      // Analytics
      getMoodAverage: (days = 7) => {
        const state = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const recentEntries = state.moodEntries.filter(
          entry => new Date(entry.timestamp) >= cutoffDate
        );
        
        if (recentEntries.length === 0) return 0;
        
        const sum = recentEntries.reduce((acc, entry) => acc + entry.mood, 0);
        return Math.round((sum / recentEntries.length) * 10) / 10;
      },

      getMoodTrend: () => {
        const state = get();
        const recent = state.moodEntries.slice(0, 7); // Last 7 entries
        const older = state.moodEntries.slice(7, 14); // Previous 7 entries
        
        if (recent.length < 3 || older.length < 3) return 'stable';
        
        const recentAvg = recent.reduce((acc, e) => acc + e.mood, 0) / recent.length;
        const olderAvg = older.reduce((acc, e) => acc + e.mood, 0) / older.length;
        
        const difference = recentAvg - olderAvg;
        
        if (difference > 0.5) return 'improving';
        if (difference < -0.5) return 'declining';
        return 'stable';
      },

      getCompletedGoalsCount: () => {
        const state = get();
        return state.wellnessGoals.filter(goal => goal.completed).length;
      }
    }),
    {
      name: 'wellness-store',
      // Only persist essential data, not functions
      partialize: (state) => ({
        moodEntries: state.moodEntries,
        currentMood: state.currentMood,
        wellnessGoals: state.wellnessGoals
      })
    }
  )
);