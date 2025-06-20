import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechCard } from '@/components/ui/TechCard';
import { TechButton } from '@/components/ui/TechButton';

export interface HintCharacterRef {
  showHint: (message: string) => void;
  showProgressiveHint: (attemptCount: number) => void;
  hideHint: () => void;
}

interface HintCharacterProps {
  className?: string;
}

const progressiveHints = [
  "Hmm, let me think about this...",
  "Here's a hint: Check your syntax carefully!",
  "Try looking at the code template for guidance.",
  "The answer might be in the lesson instructions above.",
  "Don't give up! You're getting closer to the solution."
];

export const HintCharacter = forwardRef<HintCharacterRef, HintCharacterProps>(
  ({ className = "" }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    useImperativeHandle(ref, () => ({
      showHint: (hintMessage: string) => {
        setMessage(hintMessage);
        setIsVisible(true);
        setIsAnimating(true);
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 8000);
      },
      showProgressiveHint: (attemptCount: number) => {
        const hintIndex = Math.min(attemptCount - 2, progressiveHints.length - 1);
        const progressiveMessage = progressiveHints[hintIndex];
        setMessage(progressiveMessage);
        setIsVisible(true);
        setIsAnimating(true);
        
        // Auto-hide after 10 seconds for progressive hints
        setTimeout(() => {
          setIsVisible(false);
        }, 10000);
      },
      hideHint: () => {
        setIsVisible(false);
      }
    }));

    const handleClose = () => {
      setIsVisible(false);
    };

    return (
      <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative"
            >
              {/* Character Avatar */}
              <motion.div
                animate={isAnimating ? { 
                  y: [0, -5, 0],
                  rotate: [0, 2, -2, 0]
                } : {}}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute bottom-0 right-0 w-16 h-16 z-10"
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                
                {/* Floating particles around character */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [0.5, 1, 0.5],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: i * 0.6,
                        ease: "easeInOut"
                      }}
                      className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                      style={{
                        top: `${20 + i * 20}%`,
                        left: `${80 + i * 10}%`,
                        transform: `rotate(${i * 120}deg) translateX(25px)`
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Speech Bubble */}
              <TechCard className="max-w-xs mr-20 mb-8 bg-gradient-to-br from-gray-900 via-purple-900/30 to-cyan-900/30 border-cyan-500/50">
                <div className="p-4 space-y-3">
                  {/* AI Assistant Label */}
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-tech text-xs text-cyan-400">AI Assistant</span>
                  </div>
                  
                  {/* Message */}
                  <p className="font-deputy text-sm text-gray-300 leading-relaxed">
                    {message}
                  </p>
                  
                  {/* Close Button */}
                  <div className="flex justify-end">
                    <TechButton
                      variant="secondary"
                      size="sm"
                      onClick={handleClose}
                      className="text-xs px-3 py-1"
                    >
                      Got it!
                    </TechButton>
                  </div>
                </div>
                
                {/* Speech bubble arrow */}
                <div className="absolute bottom-4 right-[-8px] w-0 h-0 border-t-8 border-t-cyan-500/50 border-l-8 border-l-transparent border-r-8 border-r-transparent"></div>
              </TechCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);