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
    // Create dust particles periodically
    const createDustParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'dust-particle';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (20 + Math.random() * 10) + 's';
      document.body.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 30000);
    };

    const interval = setInterval(createDustParticle, 3000);
    
    // Create initial particles
    for (let i = 0; i < 6; i++) {
      setTimeout(createDustParticle, i * 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-100 overflow-x-hidden">
      {/* Fixed dust particles */}
      <div className="dust-particle" style={{ top: '20%', animationDelay: '0s' }} />
      <div className="dust-particle" style={{ top: '40%', animationDelay: '-3s' }} />
      <div className="dust-particle" style={{ top: '60%', animationDelay: '-6s' }} />
      <div className="dust-particle" style={{ top: '80%', animationDelay: '-9s' }} />
      <div className="dust-particle" style={{ top: '30%', animationDelay: '-12s' }} />
      <div className="dust-particle" style={{ top: '70%', animationDelay: '-15s' }} />

      <Header onThemeToggle={toggleTheme} currentTheme={theme} />
      
      <main className="pt-20">
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

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-900 border-t border-desert-600/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-western text-xl text-desert-400 mb-4">Shadow Ranch</h3>
              <p className="text-gray-400 font-mono text-sm">
                The ultimate destination for learning Solana development through immersive gameplay.
              </p>
            </div>
            <div>
              <h4 className="font-deputy text-lg text-sunset-400 mb-4">Learn</h4>
              <ul className="space-y-2 text-gray-400 font-mono text-sm">
                <li><a href="#" className="hover:text-desert-400 transition-colors">Rust Basics</a></li>
                <li><a href="#" className="hover:text-desert-400 transition-colors">Anchor Framework</a></li>
                <li><a href="#" className="hover:text-desert-400 transition-colors">Python Seahorse</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-deputy text-lg text-sunset-400 mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400 font-mono text-sm">
                <li><a href="#" className="hover:text-desert-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-desert-400 transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-desert-400 transition-colors">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-deputy text-lg text-sunset-400 mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-desert-400 transition-colors">
                  <i className="fab fa-discord text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-desert-400 transition-colors">
                  <i className="fab fa-github text-xl" />
                </a>
                <a href="#" className="text-gray-400 hover:text-desert-400 transition-colors">
                  <i className="fab fa-twitter text-xl" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 font-mono text-sm">
              © 2024 BRB: A Solana Adventure. Built with ❤️ for the Solana community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
