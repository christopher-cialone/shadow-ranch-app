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
    <div className="min-h-screen bg-gradient-to-br from-tech-purple-900 via-slate-900 to-tech-cyan-900 text-gray-100 overflow-x-hidden relative">
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
      <footer className="bg-tech-purple-900/50 border-t border-tech-cyan-600/30 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-titulo text-xl text-tech-cyan-400 mb-4">⚡ SOLANA LAB</h3>
              <p className="text-gray-400 font-tech text-sm">
                Master blockchain development through immersive cypher-punk challenges and real-world coding.
              </p>
            </div>
            <div>
              <h4 className="font-tech text-lg text-tech-purple-400 mb-4">PROTOCOLS</h4>
              <ul className="space-y-2 text-gray-400 font-code text-sm">
                <li><a href="#" className="hover:text-tech-cyan-400 transition-colors">Rust Basics</a></li>
                <li><a href="#" className="hover:text-tech-cyan-400 transition-colors">Anchor Framework</a></li>
                <li><a href="#" className="hover:text-tech-cyan-400 transition-colors">Python Seahorse</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-tech text-lg text-tech-purple-400 mb-4">NETWORK</h4>
              <ul className="space-y-2 text-gray-400 font-code text-sm">
                <li><a href="#" className="hover:text-tech-cyan-400 transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-tech-cyan-400 transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-tech-cyan-400 transition-colors">Twitter</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-tech text-lg text-tech-purple-400 mb-4">CONNECT</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-tech-cyan-400 transition-colors">
                  <span className="text-xl">💻</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-tech-cyan-400 transition-colors">
                  <span className="text-xl">🔗</span>
                </a>
                <a href="#" className="text-gray-400 hover:text-tech-cyan-400 transition-colors">
                  <span className="text-xl">⚡</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-tech-purple-800 mt-8 pt-8 text-center">
            <p className="text-gray-500 font-code text-sm">
              © 2024 BRB: A Solana Adventure. Powered by cypher-punk innovation 🤖
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
