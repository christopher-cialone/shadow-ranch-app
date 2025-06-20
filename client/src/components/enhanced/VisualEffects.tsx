import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualEffectsProps {
  trigger?: 'networkPing' | 'sparkle' | 'coinFall' | 'messageBoard' | 'transaction' | 'dataStream' | 'blueprint' | 'dystopianCity' | 'cypherpunkSymbol' | 'codeShield' | 'digitalGhost' | 'bankBreaking' | 'decentralizedNodes' | 'blockchainBlocks' | 'smartContractGears' | 'digitalMarketplace' | 'glowingPath';
  onComplete?: () => void;
}

export function VisualEffects({ trigger, onComplete }: VisualEffectsProps) {
  const [activeEffect, setActiveEffect] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; type: string }>>([]);

  useEffect(() => {
    if (trigger) {
      setActiveEffect(trigger);
      generateParticles(trigger);
      
      const timer = setTimeout(() => {
        setActiveEffect(null);
        setParticles([]);
        onComplete?.();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  const generateParticles = (effectType: string) => {
    const newParticles = [];
    const count = getParticleCount(effectType);
    
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: `${effectType}-${i}`,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        type: effectType,
      });
    }
    
    setParticles(newParticles);
  };

  const getParticleCount = (effectType: string) => {
    switch (effectType) {
      case 'coinFall': return 20;
      case 'sparkle': return 15;
      case 'dataStream': return 30;
      case 'networkPing': return 10;
      case 'blockchainBlocks': return 8;
      default: return 12;
    }
  };

  const getParticleElement = (particle: any) => {
    switch (particle.type) {
      case 'coinFall':
        return (
          <motion.div
            key={particle.id}
            initial={{ y: -100, x: particle.x, rotate: 0 }}
            animate={{ y: window.innerHeight + 100, rotate: 360 }}
            transition={{ duration: 2, ease: "easeIn" }}
            className="fixed w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-yellow-300 shadow-lg z-50"
          >
            <div className="w-full h-full bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-full opacity-80" />
          </motion.div>
        );
        
      case 'sparkle':
        return (
          <motion.div
            key={particle.id}
            initial={{ scale: 0, x: particle.x, y: particle.y, rotate: 0 }}
            animate={{ scale: [0, 1.5, 0], rotate: 360 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed w-4 h-4 z-50"
          >
            <div className="w-full h-full bg-cyan-400 transform rotate-45" style={{
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }} />
          </motion.div>
        );
        
      case 'dataStream':
        return (
          <motion.div
            key={particle.id}
            initial={{ y: -50, x: particle.x, opacity: 1 }}
            animate={{ y: window.innerHeight + 50, opacity: 0 }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="fixed text-green-400 font-mono text-sm z-50"
          >
            {Math.random() > 0.5 ? '01010101' : '11001100'}
          </motion.div>
        );
        
      case 'networkPing':
        return (
          <motion.div
            key={particle.id}
            initial={{ scale: 0, x: particle.x, y: particle.y }}
            animate={{ scale: [0, 2, 0] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="fixed w-8 h-8 border-2 border-cyan-400 rounded-full z-50"
          />
        );
        
      case 'blockchainBlocks':
        return (
          <motion.div
            key={particle.id}
            initial={{ x: particle.x, y: particle.y, scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1, 0.8], rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="fixed w-8 h-8 bg-purple-600 border border-purple-400 z-50"
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-800 opacity-80" />
          </motion.div>
        );
        
      default:
        return (
          <motion.div
            key={particle.id}
            initial={{ scale: 0, x: particle.x, y: particle.y }}
            animate={{ scale: [0, 1, 0] }}
            transition={{ duration: 1.5 }}
            className="fixed w-2 h-2 bg-cyan-400 rounded-full z-50"
          />
        );
    }
  };

  const getBackgroundEffect = () => {
    switch (activeEffect) {
      case 'dystopianCity':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gradient-to-b from-red-900/30 to-gray-900/50 z-40"
          />
        );
        
      case 'cypherpunkSymbol':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="fixed inset-0 flex items-center justify-center z-40"
          >
            <div className="text-9xl text-cyan-400/20">⚡</div>
          </motion.div>
        );
        
      case 'digitalGhost':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: 2 }}
            className="fixed inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 z-40"
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {activeEffect && (
        <>
          {getBackgroundEffect()}
          {particles.map(particle => getParticleElement(particle))}
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for triggering visual effects
export function useVisualEffects() {
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);

  const triggerEffect = (effect: string) => {
    setCurrentEffect(effect);
    setTimeout(() => setCurrentEffect(null), 100); // Reset after brief moment
  };

  return {
    currentEffect,
    triggerEffect,
    triggerSparkle: () => triggerEffect('sparkle'),
    triggerCoinFall: () => triggerEffect('coinFall'),
    triggerDataStream: () => triggerEffect('dataStream'),
    triggerNetworkPing: () => triggerEffect('networkPing'),
    triggerBlockchain: () => triggerEffect('blockchainBlocks'),
  };
}