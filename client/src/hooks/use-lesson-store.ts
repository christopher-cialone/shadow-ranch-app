import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LessonProgress {
  lessonId: number;
  currentStep: number;
  isCompleted: boolean;
  attempts: number;
  lastAttemptAt: Date;
  completedAt?: Date;
}

interface LessonStore {
  progress: Record<number, LessonProgress>;
  currentLesson: number | null;
  
  // Actions
  getLessonProgress: (lessonId: number) => LessonProgress | undefined;
  completeLesson: (lessonId: number) => void;
  updateLessonAttempt: (lessonId: number, step: number) => void;
  getOverallProgress: () => number;
  isLessonUnlocked: (lessonId: number, requiredLessons: number[]) => boolean;
  getCompletedLessonsCount: () => number;
  setCurrentLesson: (lessonId: number | null) => void;
}

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      progress: {},
      currentLesson: null,

      getLessonProgress: (lessonId: number) => {
        const state = get();
        return state.progress[lessonId];
      },

      completeLesson: (lessonId: number) => {
        set((state) => {
          const existing = state.progress[lessonId];
          
          return { 
            progress: {
              ...state.progress,
              [lessonId]: {
                ...existing,
                lessonId,
                currentStep: existing?.currentStep || 1,
                isCompleted: true,
                attempts: existing?.attempts || 1,
                lastAttemptAt: new Date(),
                completedAt: new Date()
              }
            }
          };
        });
      },

      updateLessonAttempt: (lessonId: number, step: number) => {
        set((state) => {
          const existing = state.progress[lessonId];
          
          return {
            progress: {
              ...state.progress,
              [lessonId]: {
                ...existing,
                lessonId,
                currentStep: step,
                isCompleted: existing?.isCompleted || false,
                attempts: (existing?.attempts || 0) + 1,
                lastAttemptAt: new Date(),
                completedAt: existing?.completedAt
              }
            }
          };
        });
      },

      getOverallProgress: () => {
        const progress = get().progress;
        const completed = Object.values(progress).filter(p => p.isCompleted).length;
        const total = Object.keys(progress).length || 1;
        return Math.round((completed / total) * 100);
      },

      isLessonUnlocked: (lessonId: number, requiredLessons: number[]) => {
        const progress = get().progress;
        if (lessonId === 1) return true;
        
        return requiredLessons.every(reqId => {
          const lessonProgress = progress[reqId];
          return lessonProgress?.isCompleted || false;
        });
      },

      getCompletedLessonsCount: () => {
        const progress = get().progress;
        return Object.values(progress).filter(p => p.isCompleted).length;
      },

      setCurrentLesson: (lessonId: number | null) => {
        set({ currentLesson: lessonId });
      }
    }),
    {
      name: 'lesson-progress-storage'
    }
  )
);