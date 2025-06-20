import { Link } from "wouter";
import { WesternButton } from "@/components/ui/WesternButton";
import { WesternCard } from "@/components/ui/WesternCard";
import DecryptedText from "@/components/ui/DecryptedText";
import { useGameStore } from "@/hooks/use-game-store";
import { formatRanchCoin } from "@/lib/utils";

export default function Home() {
  const { ranchData } = useGameStore();

  return (
    <div>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background sparkle effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="sparkle-effect" style={{ top: '20%', left: '10%', animationDelay: '0s' }} />
          <div className="sparkle-effect" style={{ top: '60%', left: '80%', animationDelay: '0.5s' }} />
          <div className="sparkle-effect" style={{ top: '40%', left: '30%', animationDelay: '1s' }} />
          <div className="sparkle-effect" style={{ top: '80%', left: '60%', animationDelay: '1.5s' }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="font-western text-6xl md:text-8xl text-desert-400 mb-6 animate-glow-pulse">
              Welcome to Shadow Ranch
            </h1>
            <div className="font-deputy md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto text-[22px] font-medium space-y-4">
              <div className="text-[#98e59e]">
                <DecryptedText
                  text="We know that someone has to write software to defend privacy."
                  animateOn="view"
                  speed={50}
                  maxIterations={15}
                  revealDirection="center"
                  className="text-[#98e59e]"
                  encryptedClassName="text-purple-400"
                />
              </div>
              <div className="text-[#98e59e]">
                <DecryptedText
                  text="Discover the history of the Cypherpunks"
                  animateOn="view"
                  speed={50}
                  maxIterations={15}
                  revealDirection="center"
                  className="text-[#98e59e]"
                  encryptedClassName="text-purple-400"
                />
              </div>
              <div className="text-[#98e59e]">
                <DecryptedText
                  text="Learn to write Solana Programs through gamified challenges."
                  animateOn="view"
                  speed={50}
                  maxIterations={15}
                  revealDirection="center"
                  className="text-[#98e59e]"
                  encryptedClassName="text-purple-400"
                />
              </div>
              <div className="text-[#98e59e]">
                <DecryptedText
                  text="We are the builders"
                  animateOn="view"
                  speed={50}
                  maxIterations={15}
                  revealDirection="center"
                  className="text-[#98e59e]"
                  encryptedClassName="text-purple-400"
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link href="/lessons">
                <WesternButton variant="primary" className="text-lg">
                  <i className="fas fa-play mr-2" />
                  Start Your Adventure
                </WesternButton>
              </Link>
              <Link href="/lessons">
                <WesternButton variant="secondary" className="text-lg">
                  <i className="fas fa-book mr-2" />
                  Browse Lessons
                </WesternButton>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-western text-4xl md:text-5xl text-sunset-400 mb-6">Why Choose Shadow Ranch?</h2>
            <p className="font-deputy text-lg text-gray-300 max-w-2xl mx-auto">
              Experience the most immersive way to learn blockchain development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <WesternCard className="p-6 hover:scale-105 transition-transform duration-200 animate-slide-up">
              <div className="text-center">
                <i className="fas fa-code text-4xl text-desert-400 mb-4" />
                <h3 className="font-deputy text-xl text-desert-400 mb-3">Interactive Coding</h3>
                <p className="text-gray-300 font-mono text-sm">
                  Learn by doing with our interactive code editor and real-time feedback system.
                </p>
              </div>
            </WesternCard>

            <WesternCard className="p-6 hover:scale-105 transition-transform duration-200 animate-slide-up">
              <div className="text-center">
                <i className="fas fa-gamepad text-4xl text-sage-400 mb-4" />
                <h3 className="font-deputy text-xl text-sage-400 mb-3">Gamified Learning</h3>
                <p className="text-gray-300 font-mono text-sm">
                  Build your virtual ranch, collect characters, and earn rewards as you progress.
                </p>
              </div>
            </WesternCard>

            <WesternCard className="p-6 hover:scale-105 transition-transform duration-200 animate-slide-up">
              <div className="text-center">
                <i className="fas fa-graduation-cap text-4xl text-sunset-400 mb-4" />
                <h3 className="font-deputy text-xl text-sunset-400 mb-3">Expert Curriculum</h3>
                <p className="text-gray-300 font-mono text-sm">Learn the principles crypto was built on through carefully crafted lessons and challenges.</p>
              </div>
            </WesternCard>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-western text-4xl md:text-5xl text-rust-400 mb-6">Your Progress</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-deputy text-desert-400 mb-2">
                {formatRanchCoin(ranchData.coins)}
              </div>
              <div className="font-mono text-gray-400">Ranch Coins</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-deputy text-sage-400 mb-2">
                {ranchData.experience}
              </div>
              <div className="font-mono text-gray-400">Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-deputy text-sunset-400 mb-2">
                {ranchData.level}
              </div>
              <div className="font-mono text-gray-400">Level</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-deputy text-mystic-400 mb-2">
                0
              </div>
              <div className="font-mono text-gray-400">Lessons Complete</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
