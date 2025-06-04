import { ReactNode, useEffect, useState } from "react";
import { Header } from "./Header";
import { useGameStore } from "@/hooks/use-game-store";
import { GameCanvas } from "@/components/game/GameCanvas";
import { useTheme } from "next-themes";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const gameState = useGameStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Create data particles periodically
    const createDataParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'data-particle';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 15 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      document.body.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 25000);
    };

    const interval = setInterval(createDataParticle, 2000);
    
    // Create initial particles
    for (let i = 0; i < 8; i++) {
      setTimeout(createDataParticle, i * 500);
    }
    
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-tech-purple-900 via-slate-900 to-tech-cyan-900 text-gray-100 overflow-x-hidden relative flex flex-col">
      {/* Tech circuit pattern background */}
      <div className="absolute inset-0 opacity-5 bg-repeat" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238b5cf6' stroke-width='1'%3E%3Cpath d='M10 10h20v20H10z'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3Cpath d='M20 0v10M40 20H30M20 40V30M0 20h10'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />
      {/* Fixed data particles */}
      <div className="data-particle" style={{ top: '15%', animationDelay: '0s' }} />
      <div className="data-particle" style={{ top: '35%', animationDelay: '-2s' }} />
      <div className="data-particle" style={{ top: '55%', animationDelay: '-4s' }} />
      <div className="data-particle" style={{ top: '75%', animationDelay: '-6s' }} />
      <div className="data-particle" style={{ top: '25%', animationDelay: '-8s' }} />
      <div className="data-particle" style={{ top: '65%', animationDelay: '-10s' }} />
      <div className="data-particle" style={{ top: '45%', animationDelay: '-12s' }} />
      <div className="data-particle" style={{ top: '85%', animationDelay: '-14s' }} />
      <Header onThemeToggle={toggleTheme} currentTheme={theme} />
      <main className="pt-20 flex-grow">
        {children}
      </main>
      {/* Game Canvas Overlay */}
      <GameCanvas
        networkPingActive={gameState.networkPingActive}
        sparkleActive={gameState.sparkleActive}
        coinFallActive={gameState.coinFallActive}
        transactionActive={gameState.transactionActive}
        lastStoredMessage={gameState.lastStoredMessage}
      />
      {/* Compact Footer */}
      <footer className="bg-tech-purple-900/30 border-t border-tech-cyan-600/20 py-4 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-4">
              <span className="font-titulo text-sm text-tech-cyan-400">🏜️ BRB: A SOLANA ADVENTURE</span>
              <span className="text-gray-500 font-code text-xs">|</span>
              <span className="text-gray-400 font-code text-xs">Blockchain Development Platform</span>
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="https://x.com/Bull_Run_Boost" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-tech-cyan-400 transition-colors flex items-center space-x-1"
                title="Follow us on X"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/cialone_codes" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-tech-cyan-400 transition-colors flex items-center space-x-1"
                title="Join our Telegram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-tech-cyan-400 transition-colors font-code text-xs">DOCS</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
