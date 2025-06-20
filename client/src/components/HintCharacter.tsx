import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechCard } from './ui/TechCard';

export interface HintCharacterRef {
  showHint: (message: string) => void;
  showProgressiveHint: (attemptCount: number) => void;
}

interface HintCharacterProps {
  lessonId: number;
  currentStep: number;
}

const progressiveHints = {
  2: { // Lesson 2 hints
    3: [ // Step 3 hints
      "Remember, PDAs are derived from seeds. Check your seed construction.",
      "The seeds should include both 'ranch' and the owner's public key.",
      "Make sure you're using the correct Anchor syntax for PDA derivation."
    ]
  }
};

export const HintCharacter = forwardRef<HintCharacterRef, HintCharacterProps>(
  ({ lessonId, currentStep }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentHint, setCurrentHint] = useState('');
    const [characterMood, setCharacterMood] = useState<'neutral' | 'encouraging' | 'concerned'>('neutral');

    useImperativeHandle(ref, () => ({
      showHint: (message: string) => {
        setCurrentHint(message);
        setCharacterMood('encouraging');
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 5000);
      },
      showProgressiveHint: (attemptCount: number) => {
        const lessonHints = progressiveHints[lessonId as keyof typeof progressiveHints];
        if (lessonHints && lessonHints[currentStep as keyof typeof lessonHints]) {
          const hints = lessonHints[currentStep as keyof typeof lessonHints];
          const hintIndex = Math.min(attemptCount - 2, hints.length - 1);
          setCurrentHint(hints[hintIndex]);
          setCharacterMood(attemptCount > 3 ? 'concerned' : 'encouraging');
          setIsVisible(true);
          setTimeout(() => setIsVisible(false), 7000);
        }
      }
    }));

    const getCharacterEmoji = () => {
      switch (characterMood) {
        case 'encouraging': return '🤠';
        case 'concerned': return '😟';
        default: return '👨‍💻';
      }
    };

    const getCharacterColor = () => {
      switch (characterMood) {
        case 'encouraging': return 'from-green-900/30 to-blue-900/30 border-green-500/20';
        case 'concerned': return 'from-yellow-900/30 to-orange-900/30 border-yellow-500/20';
        default: return 'from-cyan-900/30 to-purple-900/30 border-cyan-500/20';
      }
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 max-w-sm"
          >
            <TechCard className={`p-4 bg-gradient-to-r ${getCharacterColor()}`}>
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{getCharacterEmoji()}</div>
                <div className="flex-1">
                  <h4 className="font-tech text-sm text-cyan-400 mb-2">
                    Ranch Guide
                  </h4>
                  <p className="font-deputy text-sm text-gray-300 leading-relaxed">
                    {currentHint}
                  </p>
                </div>
              </div>
            </TechCard>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);