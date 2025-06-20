import { ReactNode } from 'react';
import { TechCard } from '@/components/ui/TechCard';
import { TechButton } from '@/components/ui/TechButton';
import { Progress } from '@/components/ui/progress';

interface LessonLayoutProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
  canGoNext: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  nextButtonText: string;
  isCompleted: boolean;
  children: ReactNode;
}

export function LessonLayout({
  title,
  currentStep,
  totalSteps,
  progress,
  onPrevious,
  onNext,
  onComplete,
  canGoNext,
  hasPrevious,
  hasNext,
  nextButtonText,
  isCompleted,
  children
}: LessonLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 pt-24 pb-8">
      <div className="container mx-auto px-4">
        {/* Lesson Header */}
        <TechCard className="mb-8 p-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-cyan-500/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-tech text-3xl text-cyan-400 mb-2">{title}</h1>
              <div className="flex items-center space-x-4 text-sm font-code text-gray-400">
                <span>Step {currentStep} of {totalSteps}</span>
                <span>•</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
            <div className="w-full md:w-64">
              <Progress value={progress} className="h-3" />
            </div>
          </div>
        </TechCard>

        {/* Main Content */}
        <div className="mb-8">
          {children}
        </div>

        {/* Fixed Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-cyan-500/20 p-4 z-40">
          <div className="container mx-auto flex items-center justify-between">
            <TechButton
              variant="secondary"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="flex items-center space-x-2"
            >
              <span>←</span>
              <span>Previous</span>
            </TechButton>

            <div className="flex items-center space-x-4">
              <div className="text-sm font-code text-gray-400">
                {currentStep} / {totalSteps}
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {isCompleted ? (
              <TechButton
                variant="primary"
                onClick={onComplete}
                className="flex items-center space-x-2"
              >
                <span>Complete Lesson</span>
                <span>✓</span>
              </TechButton>
            ) : (
              <TechButton
                variant="primary"
                onClick={onNext}
                disabled={!canGoNext || !hasNext}
                className="flex items-center space-x-2"
              >
                <span>{nextButtonText}</span>
                <span>→</span>
              </TechButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}