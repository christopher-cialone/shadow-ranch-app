import { ReactNode } from "react";
import { WesternCard } from "@/components/ui/WesternCard";
import { WesternButton } from "@/components/ui/WesternButton";
import { LessonProgress } from "./LessonProgress";
import { useLocation } from "wouter";

interface LessonLayoutProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  canGoNext?: boolean;
  isCompleted?: boolean;
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
  canGoNext = false,
  isCompleted = false,
  children
}: LessonLayoutProps) {
  const [, setLocation] = useLocation();

  const handleExit = () => {
    setLocation("/lessons");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <WesternCard className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-western text-3xl text-desert-400">{title}</h1>
              <WesternButton
                variant="ghost"
                size="icon"
                onClick={handleExit}
                className="text-gray-400 hover:text-white"
              >
                <i className="fas fa-times" />
              </WesternButton>
            </div>
            
            <LessonProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              progress={progress}
            />
          </div>
        </WesternCard>

        {children}

      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4">
        <div className="container mx-auto max-w-6xl">
          <TechCard variant="purple" className="backdrop-blur-lg bg-tech-purple-900/80 border-tech-purple-600">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <TechButton
                  variant="secondary"
                  onClick={onPrevious}
                  disabled={currentStep <= 1}
                  size="sm"
                >
                  <span className="mr-2">←</span>
                  PREVIOUS
                </TechButton>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="font-tech text-xs text-gray-400 uppercase tracking-wider">PROGRESS</div>
                    <div className="font-code text-sm text-tech-cyan-400">{currentStep} / {totalSteps}</div>
                  </div>
                  
                  {isCompleted ? (
                    <TechButton
                      variant="accent"
                      onClick={onComplete}
                      size="sm"
                    >
                      <span className="mr-2">⭐</span>
                      COMPLETE LESSON
                    </TechButton>
                  ) : (
                    <TechButton
                      variant="primary"
                      onClick={onNext}
                      disabled={!canGoNext || currentStep >= totalSteps}
                      size="sm"
                    >
                      NEXT STEP
                      <span className="ml-2">→</span>
                    </TechButton>
                  )}
                </div>
              </div>
            </div>
          </TechCard>
        </div>
      </div>
    </div>
  );
}
