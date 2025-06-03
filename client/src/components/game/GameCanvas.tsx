import { useEffect, useRef } from "react";
import { useGameStore } from "@/hooks/use-game-store";

interface GameCanvasProps {
  networkPingActive?: boolean;
  sparkleActive?: boolean;
  coinFallActive?: boolean;
  transactionActive?: boolean;
  lastStoredMessage?: string | null;
}

export function GameCanvas({
  networkPingActive,
  sparkleActive,
  coinFallActive,
  transactionActive,
  lastStoredMessage
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const gameState = useGameStore();

  useEffect(() => {
    if (sparkleActive && canvasRef.current) {
      // Create sparkle effects
      for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-effect';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animationDelay = i * 0.1 + 's';
        canvasRef.current.appendChild(sparkle);
        
        setTimeout(() => {
          if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
          }
        }, 1500);
      }
    }
  }, [sparkleActive]);

  return (
    <div 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ 
        display: networkPingActive || sparkleActive || coinFallActive || transactionActive || lastStoredMessage ? 'block' : 'none' 
      }}
    >
      {/* Network ping effect */}
      {networkPingActive && (
        <div className="absolute top-4 right-4 bg-blue-500/90 text-white px-3 py-2 rounded-lg font-mono text-sm animate-pulse">
          <i className="fas fa-wifi mr-2" />
          Connecting to Solana...
        </div>
      )}

      {/* Transaction success effect */}
      {transactionActive && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500/90 text-white px-6 py-4 rounded-lg font-deputy text-lg animate-bounce">
          <i className="fas fa-check-circle mr-2" />
          Transaction Successful!
        </div>
      )}

      {/* Coin fall effect */}
      {coinFallActive && (
        <div className="absolute inset-0">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className="absolute text-sunset-400 text-2xl animate-bounce"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 50 + '%',
                animationDelay: i * 0.1 + 's',
                animationDuration: '2s'
              }}
            >
              <i className="fas fa-coins" />
            </div>
          ))}
        </div>
      )}

      {/* Stored message display */}
      {lastStoredMessage && (
        <div className="absolute bottom-4 left-4 bg-mystic-600/90 text-white px-4 py-3 rounded-lg font-mono text-sm max-w-md">
          <i className="fas fa-save mr-2" />
          {lastStoredMessage}
        </div>
      )}
    </div>
  );
}
