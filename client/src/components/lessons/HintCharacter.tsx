import { useState, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HintCharacterProps {}

export interface HintCharacterRef {
  showHint: (message: string) => void;
}

const HintCharacter = forwardRef<HintCharacterRef, HintCharacterProps>((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");

  useImperativeHandle(ref, () => ({
    showHint: (hintMessage: string) => {
      setMessage(hintMessage);
      setIsVisible(true);
      
      // Auto-hide after 7 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 7000);
    }
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-4 right-4 z-50">
          {/* Character */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            {/* Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="absolute bottom-16 right-0 mb-2 mr-4 max-w-xs"
            >
              <div className="relative bg-tech-cyan-500 text-white rounded-lg p-3 shadow-lg">
                <p className="text-sm font-code leading-relaxed">{message}</p>
                {/* Speech bubble tail */}
                <div className="absolute bottom-0 right-6 transform translate-y-full">
                  <div className="w-0 h-0 border-x-8 border-t-8 border-solid border-transparent border-t-tech-cyan-500"></div>
                </div>
              </div>
            </motion.div>

            {/* Character Image/Avatar */}
            <motion.div
              animate={{ 
                rotate: [0, 2, -2, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="w-16 h-16 bg-gradient-to-br from-tech-purple-600 to-tech-cyan-600 rounded-full flex items-center justify-center shadow-lg border-2 border-tech-cyan-400"
            >
              <span className="text-2xl">🤖</span>
            </motion.div>

            {/* Floating particles around character */}
            <motion.div
              animate={{
                y: [-2, 2, -2],
                x: [-1, 1, -1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-tech-cyan-400 rounded-full"
            />
            <motion.div
              animate={{
                y: [2, -2, 2],
                x: [1, -1, 1],
                opacity: [0.5, 0.9, 0.5]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-tech-purple-400 rounded-full"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

HintCharacter.displayName = "HintCharacter";

export { HintCharacter };