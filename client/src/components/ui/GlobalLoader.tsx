import LetterGlitch from './LetterGlitch';

interface GlobalLoaderProps {
  show: boolean;
}

export function GlobalLoader({ show }: GlobalLoaderProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm">
      <LetterGlitch
        glitchColors={["#34d399", "#06b6d4", "#8b5cf6"]} // Tech cyan, purple colors
        glitchSpeed={30}
        centerVignette={false}
        outerVignette={true}
        smooth={true}
      />
    </div>
  );
}