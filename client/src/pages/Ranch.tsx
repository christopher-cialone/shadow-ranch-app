import { useState, useEffect } from 'react';
import { TechCard } from '@/components/ui/TechCard';
import { TechButton } from '@/components/ui/TechButton';
import { GameCanvas } from '@/components/GameCanvas';
import { useGameStore } from '@/hooks/use-game-store';
import { formatRanchCoin } from '@/lib/utils';

export default function Ranch() {
  const { ranchData, ranchCoins, experience, buildings, characters } = useGameStore();
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  const handleBuildingClick = (buildingName: string) => {
    setSelectedBuilding(buildingName);
    console.log(`Clicked on ${buildingName}`);
  };

  const buildingInfo = {
    'Main House': {
      description: 'Your command center for managing the ranch and viewing progress.',
      upgrade: 'Upgrade to unlock new features and storage capacity.',
      cost: 500,
    },
    'Barn': {
      description: 'Store your livestock and manage animal-based challenges.',
      upgrade: 'Expand capacity for more advanced breeding programs.',
      cost: 300,
    },
    'Workshop': {
      description: 'Craft tools and equipment for advanced Solana development.',
      upgrade: 'Unlock specialized development environments.',
      cost: 400,
    },
    'Storage': {
      description: 'Secure storage for your digital assets and NFT collection.',
      upgrade: 'Increase security and add multi-signature features.',
      cost: 250,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 pt-24 pb-8">
      <div className="container mx-auto px-4">
        {/* Ranch Header */}
        <TechCard className="mb-8 p-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-cyan-500/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-tech text-3xl text-cyan-400 mb-2">Shadow Ranch</h1>
              <p className="font-deputy text-gray-300">Your digital frontier homestead</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="font-tech text-xl text-yellow-400">{formatRanchCoin(ranchCoins)}</div>
                <div className="font-code text-sm text-gray-400">Ranch Coins</div>
              </div>
              <div className="text-center">
                <div className="font-tech text-xl text-cyan-400">{experience}</div>
                <div className="font-code text-sm text-gray-400">Experience</div>
              </div>
              <div className="text-center">
                <div className="font-tech text-xl text-purple-400">{buildings.length}</div>
                <div className="font-code text-sm text-gray-400">Buildings</div>
              </div>
            </div>
          </div>
        </TechCard>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Ranch Simulation */}
          <div className="xl:col-span-2">
            <TechCard className="p-6 bg-gradient-to-r from-gray-900/50 to-purple-900/30 border-cyan-500/20">
              <h2 className="font-tech text-xl text-cyan-400 mb-4">Ranch Simulator</h2>
              <GameCanvas 
                width={800} 
                height={600} 
                onRanchClick={handleBuildingClick}
              />
            </TechCard>
          </div>

          {/* Building Information */}
          <div className="space-y-6">
            {selectedBuilding ? (
              <TechCard className="p-6 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border-cyan-500/20">
                <h3 className="font-tech text-xl text-cyan-400 mb-4">{selectedBuilding}</h3>
                <div className="space-y-4">
                  <p className="font-deputy text-gray-300 leading-relaxed">
                    {buildingInfo[selectedBuilding as keyof typeof buildingInfo]?.description}
                  </p>
                  <div className="border-t border-gray-700 pt-4">
                    <h4 className="font-tech text-sm text-cyan-400 mb-2">Upgrade Available</h4>
                    <p className="font-code text-sm text-gray-400 mb-3">
                      {buildingInfo[selectedBuilding as keyof typeof buildingInfo]?.upgrade}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-yellow-400">
                        {formatRanchCoin(buildingInfo[selectedBuilding as keyof typeof buildingInfo]?.cost || 0)}
                      </span>
                      <TechButton 
                        variant="primary" 
                        size="sm"
                        disabled={ranchCoins < (buildingInfo[selectedBuilding as keyof typeof buildingInfo]?.cost || 0)}
                      >
                        Upgrade
                      </TechButton>
                    </div>
                  </div>
                </div>
              </TechCard>
            ) : (
              <TechCard className="p-6 bg-gradient-to-r from-gray-900/50 to-cyan-900/30 border-cyan-500/20">
                <h3 className="font-tech text-xl text-cyan-400 mb-4">Ranch Management</h3>
                <p className="font-deputy text-gray-300 leading-relaxed">
                  Click on any building in the simulation to view details and manage upgrades.
                </p>
              </TechCard>
            )}

            {/* Quick Stats */}
            <TechCard className="p-6 bg-gradient-to-r from-purple-900/30 to-gray-900/50 border-purple-500/20">
              <h3 className="font-tech text-xl text-purple-400 mb-4">Ranch Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-code text-gray-400">Buildings Owned</span>
                  <span className="font-tech text-purple-400">{buildings.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-code text-gray-400">Characters</span>
                  <span className="font-tech text-purple-400">{characters.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-code text-gray-400">Ranch Level</span>
                  <span className="font-tech text-purple-400">{Math.floor(experience / 100) + 1}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-code text-gray-400">Total Value</span>
                  <span className="font-tech text-yellow-400">{formatRanchCoin(ranchCoins + buildings.length * 200)}</span>
                </div>
              </div>
            </TechCard>

            {/* Actions */}
            <TechCard className="p-6 bg-gradient-to-r from-cyan-900/30 to-gray-900/50 border-cyan-500/20">
              <h3 className="font-tech text-xl text-cyan-400 mb-4">Ranch Actions</h3>
              <div className="space-y-3">
                <TechButton variant="primary" className="w-full">
                  Collect Resources
                </TechButton>
                <TechButton variant="secondary" className="w-full">
                  Manage Characters
                </TechButton>
                <TechButton variant="outline" className="w-full">
                  View NFT Collection
                </TechButton>
              </div>
            </TechCard>
          </div>
        </div>
      </div>
    </div>
  );
}