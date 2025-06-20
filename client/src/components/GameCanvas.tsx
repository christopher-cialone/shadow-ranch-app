import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';

interface GameCanvasProps {
  width?: number;
  height?: number;
  onRanchClick?: (building: string) => void;
}

interface VisualEffect {
  type: 'sparkle' | 'coinFall' | 'dataStream' | 'networkPing' | 'blockchain';
  x: number;
  y: number;
  timestamp: number;
}

export function GameCanvas({ width = 800, height = 600, onRanchClick }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [effects, setEffects] = useState<VisualEffect[]>([]);
  const effectsRef = useRef<PIXI.Container>();

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize PIXI Application
    const app = new PIXI.Application({
      view: canvasRef.current,
      width,
      height,
      backgroundColor: 0x0a0a0a,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    appRef.current = app;

    // Create main containers
    const backgroundContainer = new PIXI.Container();
    const ranchContainer = new PIXI.Container();
    const effectsContainer = new PIXI.Container();
    const uiContainer = new PIXI.Container();

    effectsRef.current = effectsContainer;

    app.stage.addChild(backgroundContainer);
    app.stage.addChild(ranchContainer);
    app.stage.addChild(effectsContainer);
    app.stage.addChild(uiContainer);

    // Create animated background
    createAnimatedBackground(backgroundContainer);

    // Create ranch buildings
    createRanchBuildings(ranchContainer, onRanchClick);

    // Create floating particles
    createParticleSystem(effectsContainer);

    // Add tech grid overlay
    createTechGrid(uiContainer);

    return () => {
      app.destroy(true, { children: true, texture: true, baseTexture: true });
    };
  }, [width, height, onRanchClick]);

  const createAnimatedBackground = (container: PIXI.Container) => {
    // Create gradient background
    const bg = new PIXI.Graphics();
    bg.beginFill(0x0a0a0a);
    bg.drawRect(0, 0, width, height);
    bg.endFill();
    container.addChild(bg);

    // Add animated stars
    for (let i = 0; i < 50; i++) {
      const star = new PIXI.Graphics();
      star.beginFill(0x00ffff, Math.random() * 0.8 + 0.2);
      star.drawCircle(0, 0, Math.random() * 2 + 0.5);
      star.endFill();
      star.x = Math.random() * width;
      star.y = Math.random() * height;
      
      // Animate star twinkling
      const twinkle = () => {
        star.alpha = 0.3 + Math.sin(Date.now() * 0.001 + i) * 0.7;
        requestAnimationFrame(twinkle);
      };
      twinkle();
      
      container.addChild(star);
    }
  };

  const createRanchBuildings = (container: PIXI.Container, clickHandler?: (building: string) => void) => {
    const buildings = [
      { name: 'Main House', x: width * 0.3, y: height * 0.6, color: 0x8b4513 },
      { name: 'Barn', x: width * 0.6, y: height * 0.7, color: 0x654321 },
      { name: 'Workshop', x: width * 0.7, y: height * 0.4, color: 0x2f4f4f },
      { name: 'Storage', x: width * 0.2, y: height * 0.8, color: 0x696969 },
    ];

    buildings.forEach(building => {
      const buildingSprite = new PIXI.Graphics();
      buildingSprite.beginFill(building.color);
      buildingSprite.drawRect(0, 0, 80, 60);
      buildingSprite.endFill();
      
      // Add roof
      buildingSprite.beginFill(0x8b0000);
      buildingSprite.drawPolygon([0, 0, 40, -20, 80, 0]);
      buildingSprite.endFill();
      
      buildingSprite.x = building.x;
      buildingSprite.y = building.y;
      buildingSprite.interactive = true;
      buildingSprite.buttonMode = true;
      
      // Add glow effect
      const glow = new PIXI.Graphics();
      glow.beginFill(0x00ffff, 0.1);
      glow.drawRect(-5, -5, 90, 70);
      glow.endFill();
      glow.visible = false;
      buildingSprite.addChild(glow);
      
      buildingSprite.on('pointerover', () => {
        glow.visible = true;
        buildingSprite.scale.set(1.05);
      });
      
      buildingSprite.on('pointerout', () => {
        glow.visible = false;
        buildingSprite.scale.set(1.0);
      });
      
      buildingSprite.on('pointerdown', () => {
        if (clickHandler) {
          clickHandler(building.name);
        }
        triggerBuildingEffect(building.x + 40, building.y + 30);
      });
      
      container.addChild(buildingSprite);
      
      // Add building label
      const label = new PIXI.Text(building.name, {
        fontFamily: 'monospace',
        fontSize: 12,
        fill: 0x00ffff,
        align: 'center',
      });
      label.anchor.set(0.5);
      label.x = building.x + 40;
      label.y = building.y - 10;
      container.addChild(label);
    });
  };

  const createParticleSystem = (container: PIXI.Container) => {
    for (let i = 0; i < 20; i++) {
      const particle = new PIXI.Graphics();
      particle.beginFill(0x00ffff, 0.5);
      particle.drawCircle(0, 0, 1);
      particle.endFill();
      
      particle.x = Math.random() * width;
      particle.y = Math.random() * height;
      
      const animate = () => {
        particle.y -= 0.5;
        particle.x += Math.sin(Date.now() * 0.001 + i) * 0.5;
        particle.alpha = 0.3 + Math.sin(Date.now() * 0.002 + i) * 0.3;
        
        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }
        
        requestAnimationFrame(animate);
      };
      animate();
      
      container.addChild(particle);
    }
  };

  const createTechGrid = (container: PIXI.Container) => {
    const grid = new PIXI.Graphics();
    grid.lineStyle(1, 0x00ffff, 0.1);
    
    // Vertical lines
    for (let x = 0; x < width; x += 50) {
      grid.moveTo(x, 0);
      grid.lineTo(x, height);
    }
    
    // Horizontal lines
    for (let y = 0; y < height; y += 50) {
      grid.moveTo(0, y);
      grid.lineTo(width, y);
    }
    
    container.addChild(grid);
  };

  const triggerBuildingEffect = (x: number, y: number) => {
    if (!effectsRef.current) return;
    
    // Create sparkle effect
    for (let i = 0; i < 10; i++) {
      const sparkle = new PIXI.Graphics();
      sparkle.beginFill(0xffff00, 0.8);
      sparkle.drawStar(0, 0, 4, 8, 4);
      sparkle.endFill();
      
      sparkle.x = x + (Math.random() - 0.5) * 40;
      sparkle.y = y + (Math.random() - 0.5) * 40;
      
      effectsRef.current.addChild(sparkle);
      
      // Animate sparkle
      let scale = 0;
      const animate = () => {
        scale += 0.1;
        sparkle.scale.set(scale);
        sparkle.rotation += 0.2;
        sparkle.alpha = 1 - scale;
        
        if (scale >= 1) {
          effectsRef.current?.removeChild(sparkle);
          sparkle.destroy();
        } else {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  };

  // Expose effect triggers
  const triggerCoinFall = () => {
    if (!effectsRef.current) return;
    
    for (let i = 0; i < 15; i++) {
      const coin = new PIXI.Graphics();
      coin.beginFill(0xffd700);
      coin.drawCircle(0, 0, 6);
      coin.endFill();
      coin.beginFill(0xffff00);
      coin.drawCircle(0, 0, 4);
      coin.endFill();
      
      coin.x = Math.random() * width;
      coin.y = -20;
      
      effectsRef.current.addChild(coin);
      
      const animate = () => {
        coin.y += 5 + Math.random() * 3;
        coin.rotation += 0.2;
        
        if (coin.y > height + 20) {
          effectsRef.current?.removeChild(coin);
          coin.destroy();
        } else {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  };

  const triggerDataStream = () => {
    if (!effectsRef.current) return;
    
    for (let i = 0; i < 20; i++) {
      const data = new PIXI.Text('01', {
        fontFamily: 'monospace',
        fontSize: 14,
        fill: 0x00ff00,
      });
      
      data.x = Math.random() * width;
      data.y = -20;
      
      effectsRef.current.addChild(data);
      
      const animate = () => {
        data.y += 3;
        data.alpha = 1 - (data.y / height);
        
        if (data.y > height + 20) {
          effectsRef.current?.removeChild(data);
          data.destroy();
        } else {
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  };

  // Expose trigger functions
  useEffect(() => {
    (window as any).triggerCoinFall = triggerCoinFall;
    (window as any).triggerDataStream = triggerDataStream;
    
    return () => {
      delete (window as any).triggerCoinFall;
      delete (window as any).triggerDataStream;
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-cyan-500/20 rounded-lg shadow-lg shadow-cyan-500/10"
      />
      <div className="absolute top-4 left-4 font-tech text-cyan-400 text-sm">
        SHADOW RANCH SIMULATOR v2.0
      </div>
    </div>
  );
}