import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import "./ScrambledText.css";

interface ScrambledTextProps {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
  children,
}: ScrambledTextProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [chars, setChars] = useState<string[]>([]);
  const originalText = children?.toString() || "";

  useEffect(() => {
    // Split text into individual characters
    setChars(originalText.split(''));
  }, [originalText]);

  const scrambleChar = (originalChar: string, intensity: number) => {
    if (originalChar === ' ') return ' ';
    if (Math.random() > intensity) return originalChar;
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!rootRef.current) return;

    const charElements = rootRef.current.querySelectorAll('.char');
    charElements.forEach((charEl, index) => {
      const rect = charEl.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;
      
      const dx = e.clientX - charCenterX;
      const dy = e.clientY - charCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const intensity = 1 - (distance / radius);
        const scrambleCount = Math.floor(intensity * 5) + 3;
        
        // Clear any existing interval for this character
        const existingInterval = (charEl as any).scrambleInterval;
        if (existingInterval) {
          clearInterval(existingInterval);
        }
        
        // Animate scrambling effect
        let iterations = 0;
        const scrambleInterval = setInterval(() => {
          const scrambledChar = scrambleChar(originalText[index], intensity);
          charEl.textContent = scrambledChar;
          
          iterations++;
          if (iterations >= scrambleCount) {
            clearInterval(scrambleInterval);
            (charEl as any).scrambleInterval = null;
            // Reveal original character
            setTimeout(() => {
              charEl.textContent = originalText[index];
            }, duration * 50);
          }
        }, speed * 50);
        
        (charEl as any).scrambleInterval = scrambleInterval;
      }
    });
  };

  return (
    <span 
      ref={rootRef} 
      className={`text-block ${className}`} 
      style={style}
      onMouseMove={handleMouseMove}
    >
      {chars.map((char, index) => (
        <span key={index} className="char" data-original={char}>
          {char}
        </span>
      ))}
    </span>
  );
};

export default ScrambledText;