import { Link, useLocation } from "wouter";
import { WalletButton } from "@/components/wallet/WalletButton";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onThemeToggle: () => void;
  currentTheme?: string;
}

export function Header({ onThemeToggle, currentTheme }: HeaderProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/lessons", label: "Lessons" },
    { href: "/ranch", label: "My Ranch" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-tech-purple-900/95 backdrop-blur-sm border-b border-tech-cyan-600/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-4 cursor-pointer">
            <span className="text-tech-cyan-400 text-2xl animate-tech-pulse">🏜️</span>
            <h1 className="font-titulo text-2xl bg-gradient-to-r from-tech-cyan-400 to-tech-purple-400 bg-clip-text text-transparent">
              BRB: SHADOW RANCH
            </h1>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "font-tech text-gray-300 hover:text-tech-cyan-400 transition-colors uppercase tracking-wider",
                  location === item.href && "text-tech-cyan-400"
                )}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <WalletButton />
          <button
            onClick={onThemeToggle}
            className="p-2 text-gray-400 hover:text-tech-cyan-400 transition-colors"
            aria-label="Toggle theme"
          >
            <span className="text-lg">{currentTheme === 'dark' ? '🌙' : '☀️'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
