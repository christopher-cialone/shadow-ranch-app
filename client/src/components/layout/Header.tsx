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
    { href: "/playground", label: "Playground" },
    { href: "/ranch", label: "My Ranch" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-desert-600/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-4 cursor-pointer">
            <i className="fas fa-star text-desert-400 text-2xl animate-sheriff-star" />
            <h1 className="font-western text-2xl text-desert-400">BRB: A Solana Adventure</h1>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "font-deputy text-gray-300 hover:text-desert-400 transition-colors",
                  location === item.href && "text-desert-400"
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
            className="p-2 text-gray-400 hover:text-desert-400 transition-colors"
            aria-label="Toggle theme"
          >
            <i className={`fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
