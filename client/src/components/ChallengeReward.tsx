import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChallengeRewardProps {
  isVisible: boolean;
  nftImageUrl: string;
  lessonId: number;
  badgeName: string;
  onComplete: () => void;
}

export function ChallengeReward({ isVisible, nftImageUrl, lessonId, badgeName, onComplete }: ChallengeRewardProps) {
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowReward(true);
      const timer = setTimeout(() => {
        setShowReward(false);
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {showReward && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center p-8 bg-gradient-to-br from-purple-900/90 to-cyan-900/90 rounded-2xl border border-cyan-500/30 max-w-md mx-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
              className="mb-6"
            >
              <img 
                src={nftImageUrl} 
                alt="Challenge Reward NFT"
                className="w-32 h-32 mx-auto rounded-lg border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/25"
              />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="font-tech text-2xl text-cyan-400 mb-2"
            >
              Challenge Complete!
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="font-deputy text-gray-300 mb-4"
            >
              {badgeName}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-sm font-code text-cyan-300"
            >
              NFT Badge Earned!
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}