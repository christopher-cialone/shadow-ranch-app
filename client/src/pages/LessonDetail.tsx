import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { WesternCard, WesternCardContent, WesternCardHeader, WesternCardTitle } from "@/components/ui/WesternCard";
import { WesternButton } from "@/components/ui/WesternButton";
import { NarrativeBox } from "@/components/lessons/NarrativeBox";
import { LessonLayout } from "@/components/lessons/LessonLayout";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { useLessonStore } from "@/hooks/use-lesson-store";
import { useGameStore } from "@/hooks/use-game-store";
import { useToast } from "@/hooks/use-toast";
import { formatRanchCoin } from "@/lib/utils";
import type { Lesson } from "@shared/schema";

export default function LessonDetail() {
  const [, params] = useRoute("/lessons/:id");
  const lessonId = parseInt(params?.id || "0");
  
  const [currentStep, setCurrentStep] = useState(1);
  const [language, setLanguage] = useState("rust");
  const [code, setCode] = useState("");
  const [hintVisible, setHintVisible] = useState(false);
  const [validationResults, setValidationResults] = useState<any>(null);

  const { data: lesson, isLoading } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${lessonId}`],
    enabled: !!lessonId,
  });

  const { getLessonProgress, updateLessonAttempt, completeLesson, setCurrentLesson } = useLessonStore();
  const gameStore = useGameStore();
  const { toast } = useToast();

  const progress = getLessonProgress(lessonId);
  const currentStepData = lesson?.steps.find(step => step.id === currentStep);

  useEffect(() => {
    if (lesson) {
      setCurrentLesson(lessonId);
      const savedProgress = getLessonProgress(lessonId);
      if (savedProgress && savedProgress.currentStep > 0) {
        setCurrentStep(savedProgress.currentStep);
      }
      
      // Set starter code if available
      const step = lesson.steps.find(s => s.id === currentStep);
      if (step?.starterCode) {
        setCode(step.starterCode);
      }
    }
  }, [lesson, lessonId, currentStep]);

  const progressPercentage = lesson ? (currentStep / lesson.steps.length) * 100 : 0;
  const canGoNext = validationResults?.success || false;
  const isCompleted = currentStep >= (lesson?.steps.length || 0) && canGoNext;

  const handleCodeRun = (data: any) => {
    if (data.success) {
      gameStore.triggerSparkleAnimation();
      gameStore.setLastStoredMessage("Code executed successfully!");
    }
    setValidationResults(data);
  };

  const handleCodeValidate = (data: any) => {
    setValidationResults(data);
    if (data.success) {
      updateLessonAttempt(lessonId, currentStep);
    }
  };

  const handleNext = () => {
    if (lesson && currentStep < lesson.steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setValidationResults(null);
      setHintVisible(false);
      
      // Load starter code for next step
      const stepData = lesson.steps.find(s => s.id === nextStep);
      if (stepData?.starterCode) {
        setCode(stepData.starterCode);
      } else {
        setCode("");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setValidationResults(null);
      setHintVisible(false);
      
      // Load starter code for previous step
      const stepData = lesson?.steps.find(s => s.id === prevStep);
      if (stepData?.starterCode) {
        setCode(stepData.starterCode);
      }
    }
  };

  const handleComplete = () => {
    completeLesson(lessonId);
    gameStore.earnRanchCoin(lesson?.reward || 100);
    gameStore.addExperience(50);
    gameStore.triggerCoinFall();
    
    toast({
      title: "Lesson Completed!",
      description: `You earned ${formatRanchCoin(lesson?.reward || 100)} Ranch Coins and 50 XP!`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-desert-400 mb-4" />
          <p className="font-deputy text-xl text-gray-300">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WesternCard className="p-8 text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-sunset-400 mb-4" />
          <h2 className="font-deputy text-2xl text-gray-300 mb-4">Lesson Not Found</h2>
          <p className="font-mono text-gray-400">The requested lesson could not be found.</p>
        </WesternCard>
      </div>
    );
  }

  return (
    <LessonLayout
      title={lesson.title}
      currentStep={currentStep}
      totalSteps={lesson.steps.length}
      progress={progressPercentage}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onComplete={handleComplete}
      canGoNext={canGoNext}
      isCompleted={isCompleted}
    >
      <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-300px)]">
        {/* Left Panel: Narrative & Instructions */}
        <div className="lg:col-span-1">
          <WesternCard className="h-full">
            <WesternCardContent className="p-6 overflow-y-auto h-full">
              {currentStepData && (
                <>
                  <NarrativeBox variant="story">
                    {currentStepData.narrative}
                  </NarrativeBox>

                  <NarrativeBox variant="challenge" icon="fa-target" title="Challenge Objectives">
                    <ul className="space-y-2">
                      {currentStepData.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <i className={`fas ${
                            validationResults?.results?.[index]?.passed ? 'fa-check-circle text-sage-400' : 'far fa-circle text-gray-500'
                          } mr-2 mt-1`} />
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </NarrativeBox>

                  {currentStepData.hints.length > 0 && (
                    <div className="bg-gradient-to-r from-mystic-800/30 to-mystic-700/30 border border-mystic-600 p-4 rounded-lg">
                      <button 
                        className="flex items-center justify-between w-full text-left"
                        onClick={() => setHintVisible(!hintVisible)}
                      >
                        <h4 className="font-deputy text-mystic-400 flex items-center">
                          <i className="fas fa-lightbulb mr-2" />
                          Need a Hint?
                        </h4>
                        <i className={`fas fa-chevron-${hintVisible ? 'up' : 'down'} text-mystic-400`} />
                      </button>
                      {hintVisible && (
                        <div className="mt-3 space-y-2">
                          {currentStepData.hints.map((hint, index) => (
                            <div key={index} className="text-sm text-gray-300 font-mono">
                              • {hint}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </WesternCardContent>
          </WesternCard>
        </div>

        {/* Middle Panel: Code Editor */}
        <div className="lg:col-span-1">
          <WesternCard className="h-full">
            <WesternCardContent className="p-6 h-full">
              <MonacoEditor
                value={code}
                onChange={setCode}
                language={language}
                onLanguageChange={setLanguage}
                height="100%"
                onRun={handleCodeRun}
                onValidate={handleCodeValidate}
                lessonId={lessonId}
                currentStep={currentStep}
              />
            </WesternCardContent>
          </WesternCard>
        </div>

        {/* Right Panel: Game Canvas */}
        <div className="lg:col-span-1">
          <WesternCard className="h-full">
            <WesternCardContent className="p-6 h-full">
              <h3 className="font-deputy text-xl text-rust-400 mb-4 flex items-center">
                <i className="fas fa-tv mr-2" />
                Shadow Ranch Live
              </h3>
              
              {/* Mock ranch scene */}
              <div className="bg-gradient-to-b from-desert-800 to-desert-900 rounded-lg h-64 relative overflow-hidden border-2 border-desert-600 mb-6">
                <div className="absolute inset-0 bg-gradient-to-b from-sunset-400/20 to-transparent" />
                
                {/* Ranch buildings */}
                <div className="absolute bottom-4 left-4 w-16 h-12 bg-leather-700 rounded-t-lg border border-leather-600">
                  <div className="w-full h-3 bg-rust-600 rounded-t-lg" />
                </div>
                <div className="absolute bottom-4 right-4 w-20 h-16 bg-sage-700 rounded border border-sage-600">
                  <div className="w-full h-4 bg-sage-600 rounded-t" />
                </div>
                
                {/* Character */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-desert-600 rounded-full">
                  <div className="w-4 h-4 bg-leather-600 rounded-full mx-auto mt-1" />
                </div>
                
                {/* Status overlay */}
                <div className="absolute top-4 left-4 bg-black/70 rounded px-2 py-1">
                  <div className="text-xs text-desert-400 font-mono">Ranch Coins: {formatRanchCoin(gameStore.ranchData.coins)}</div>
                  <div className="text-xs text-sage-400 font-mono">XP: {gameStore.ranchData.experience}</div>
                </div>
                
                {/* Success animation area */}
                {validationResults?.success && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-green-500/90 text-white px-4 py-2 rounded-lg font-deputy animate-bounce">
                      <i className="fas fa-check-circle mr-2" />
                      Code Validated Successfully!
                    </div>
                  </div>
                )}
              </div>

              {/* Ranch Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-desert-800/50 to-desert-700/50 p-3 rounded border border-desert-600">
                  <div className="text-xs text-desert-400 font-mono mb-1">Buildings</div>
                  <div className="text-lg font-deputy text-white">{gameStore.buildings.length}</div>
                </div>
                <div className="bg-gradient-to-r from-sage-800/50 to-sage-700/50 p-3 rounded border border-sage-600">
                  <div className="text-xs text-sage-400 font-mono mb-1">Characters</div>
                  <div className="text-lg font-deputy text-white">{gameStore.characters.length}</div>
                </div>
              </div>

              {/* Validation Results */}
              {validationResults && (
                <div className={`p-3 rounded border text-sm font-mono ${
                  validationResults.success 
                    ? 'bg-green-800/30 border-green-600 text-green-300'
                    : 'bg-red-800/30 border-red-600 text-red-300'
                }`}>
                  <div className="flex items-center mb-2">
                    <i className={`fas ${validationResults.success ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`} />
                    {validationResults.message}
                  </div>
                  {validationResults.errors && validationResults.errors.length > 0 && (
                    <ul className="text-xs space-y-1">
                      {validationResults.errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </WesternCardContent>
          </WesternCard>
        </div>
      </div>
    </LessonLayout>
  );
}
