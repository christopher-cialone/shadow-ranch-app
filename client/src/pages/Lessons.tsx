import { Link } from "wouter";
import { WesternButton } from "@/components/ui/WesternButton";
import { WesternCard, WesternCardContent, WesternCardHeader, WesternCardTitle } from "@/components/ui/WesternCard";
import { useLessonStore } from "@/hooks/use-lesson-store";
import { formatRanchCoin, getRarityColor } from "@/lib/utils";
import { lessons, type LessonData } from "@/data/lessons";

export default function Lessons() {
  const { getLessonProgress, isLessonUnlocked } = useLessonStore();



  return (
    <div className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-western text-4xl md:text-5xl text-sunset-400 mb-6">Choose Your Path</h1>
          <p className="font-deputy text-lg text-gray-300 max-w-2xl mx-auto">
            Master the art of Solana development through hands-on challenges. Each lesson brings you closer to becoming a blockchain pioneer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessons?.map((lesson) => {
            const progress = getLessonProgress(lesson.id);
            const isUnlocked = isLessonUnlocked(lesson.id, lesson.requiredLessons || []);
            const progressPercentage = progress?.isCompleted ? 100 : 
              progress?.currentStep ? (progress.currentStep / lesson.content.steps.length) * 100 : 0;

            return (
              <WesternCard 
                key={lesson.id} 
                className={`hover:scale-105 transition-transform duration-200 animate-slide-up ${
                  !isUnlocked ? 'opacity-60' : ''
                }`}
              >
                <WesternCardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <WesternCardTitle className="text-xl">{lesson.title}</WesternCardTitle>
                    <span className={`px-2 py-1 rounded text-sm font-mono ${getRarityColor(lesson.difficulty)} bg-gray-800`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                </WesternCardHeader>
                
                <WesternCardContent>
                  <p className="text-gray-300 mb-4 font-mono text-sm">
                    {lesson.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-desert-400">
                      <i className="fas fa-clock mr-1" />
                      <span className="text-sm">{lesson.duration}</span>
                    </div>
                    <div className="flex items-center text-sunset-400">
                      <i className="fas fa-coins mr-1" />
                      <span className="text-sm">+{formatRanchCoin(lesson.reward)} RC</span>
                    </div>
                  </div>
                  
                  <div className="progress-trail h-2 rounded-full mb-4">
                    <div 
                      className="bg-gradient-to-r from-desert-500 to-sunset-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  
                  {isUnlocked ? (
                    <Link href={`/lessons/${lesson.id}`}>
                      <WesternButton variant="primary" className="w-full">
                        <i className="fas fa-horse mr-2" />
                        {progress?.isCompleted ? 'Review Lesson' : 
                         progress?.currentStep ? 'Continue Lesson' : 'Start Lesson'}
                      </WesternButton>
                    </Link>
                  ) : (
                    <WesternButton 
                      variant="ghost" 
                      className="w-full cursor-not-allowed" 
                      disabled
                    >
                      <i className="fas fa-lock mr-2" />
                      Complete Previous Lessons
                    </WesternButton>
                  )}
                </WesternCardContent>
              </WesternCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
