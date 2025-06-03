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

        {/* Navigation */}
        <WesternCard className="mt-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <WesternButton
                variant="secondary"
                onClick={onPrevious}
                disabled={currentStep <= 1}
              >
                <i className="fas fa-arrow-left mr-2" />
                Previous
              </WesternButton>
              
              <div className="flex space-x-3">
                {isCompleted ? (
                  <WesternButton
                    variant="primary"
                    onClick={onComplete}
                    glow
                  >
                    <i className="fas fa-star mr-2" />
                    Complete Lesson
                  </WesternButton>
                ) : (
                  <WesternButton
                    variant="primary"
                    onClick={onNext}
                    disabled={!canGoNext || currentStep >= totalSteps}
                  >
                    Next Step
                    <i className="fas fa-arrow-right ml-2" />
                  </WesternButton>
                )}
              </div>
            </div>
          </div>
        </WesternCard>
      </div>
    </div>
  );
}
