import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TechCard } from '@/components/ui/TechCard';
import { TechButton } from '@/components/ui/TechButton';

interface ChallengeRewardProps {
  isVisible: boolean;
  onClose: () => void;
  reward: {
    title: string;
    description: string;
    coins: number;
    xp: number;
    nftImageUrl: string;
  };
}

export function ChallengeReward({ isVisible, onClose, reward }: ChallengeRewardProps) {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.6 }}
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            {/* Particle Effects */}
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      scale: 0, 
                      x: 0, 
                      y: 0, 
                      opacity: 1,
                      rotate: 0 
                    }}
                    animate={{ 
                      scale: [0, 1, 0], 
                      x: (Math.random() - 0.5) * 400,
                      y: (Math.random() - 0.5) * 400,
                      opacity: [1, 1, 0],
                      rotate: 360
                    }}
                    transition={{ 
                      duration: 2, 
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                  />
                ))}
              </div>
            )}

            <TechCard className="max-w-md bg-gradient-to-br from-gray-900 via-purple-900/30 to-cyan-900/30 border-cyan-500/50">
              <div className="text-center space-y-6 p-6">
                {/* NFT Reward Image */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative mx-auto w-32 h-32"
                >
                  <img
                    src={reward.nftImageUrl}
                    alt="NFT Reward"
                    className="w-full h-full object-cover rounded-lg border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/25"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 rounded-lg border-2 border-transparent bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 opacity-75"
                    style={{
                      background: 'conic-gradient(from 0deg, #06b6d4, #8b5cf6, #06b6d4)',
                    }}
                  />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="font-tech text-2xl text-cyan-400"
                >
                  {reward.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="font-deputy text-gray-300"
                >
                  {reward.description}
                </motion.p>

                {/* Rewards */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex justify-center space-x-6"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{reward.coins}</div>
                    <div className="text-sm text-gray-400">Ranch Coins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{reward.xp}</div>
                    <div className="text-sm text-gray-400">XP</div>
                  </div>
                </motion.div>

                {/* Close Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <TechButton
                    variant="primary"
                    onClick={onClose}
                    className="w-full"
                  >
                    Continue Adventure
                  </TechButton>
                </motion.div>
              </div>
            </TechCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}