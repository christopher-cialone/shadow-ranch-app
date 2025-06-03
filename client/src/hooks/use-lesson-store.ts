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
  progress: Map<number, LessonProgress>;
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
      progress: new Map(),
      currentLesson: null,

      getLessonProgress: (lessonId: number) => {
        return get().progress.get(lessonId);
      },

      completeLesson: (lessonId: number) => {
        set((state) => {
          const newProgress = new Map(state.progress);
          const existing = newProgress.get(lessonId);
          
          newProgress.set(lessonId, {
            ...existing,
            lessonId,
            currentStep: existing?.currentStep || 1,
            isCompleted: true,
            attempts: existing?.attempts || 1,
            lastAttemptAt: new Date(),
            completedAt: new Date()
          });
          
          return { progress: newProgress };
        });
      },

      updateLessonAttempt: (lessonId: number, step: number) => {
        set((state) => {
          const newProgress = new Map(state.progress);
          const existing = newProgress.get(lessonId);
          
          newProgress.set(lessonId, {
            lessonId,
            currentStep: step,
            isCompleted: existing?.isCompleted || false,
            attempts: (existing?.attempts || 0) + 1,
            lastAttemptAt: new Date(),
            completedAt: existing?.completedAt
          });
          
          return { progress: newProgress };
        });
      },

      getOverallProgress: () => {
        const progress = get().progress;
        const completed = Array.from(progress.values()).filter(p => p.isCompleted).length;
        const total = progress.size || 1;
        return Math.round((completed / total) * 100);
      },

      isLessonUnlocked: (lessonId: number, requiredLessons: number[]) => {
        if (requiredLessons.length === 0) return true;
        
        const progress = get().progress;
        return requiredLessons.every(reqId => {
          const reqProgress = progress.get(reqId);
          return reqProgress?.isCompleted === true;
        });
      },

      getCompletedLessonsCount: () => {
        const progress = get().progress;
        return Array.from(progress.values()).filter(p => p.isCompleted).length;
      },

      setCurrentLesson: (lessonId: number | null) => {
        set({ currentLesson: lessonId });
      }
    }),
    {
      name: 'lesson-store',
      serialize: (state) => JSON.stringify({
        ...state,
        progress: Array.from(state.progress.entries())
      }),
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          progress: new Map(parsed.progress || [])
        };
      }
    }
  )
);
