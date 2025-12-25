import React, { useState, useRef, useCallback } from 'react';
import ChristmasTree, { ChristmasTreeHandle } from './components/ChristmasTree';
import MerryChristmas from './components/MerryChristmas';
import Music from './components/Music';

const App: React.FC = () => {
  const [showText, setShowText] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  const treeRef = useRef<ChristmasTreeHandle>(null);

  const handleReplay = () => {
    setShowText(false);
    setShowReplay(false);
    if (treeRef.current) {
      treeRef.current.reset();
    }
  };

  const handleTextComplete = useCallback(() => {
    setShowReplay(true);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden font-sans">
      <Music />
      <ChristmasTree ref={treeRef} onAnimationComplete={() => setShowText(true)} />
      {showText && <MerryChristmas onComplete={handleTextComplete} />}
      
      {showReplay && (
        <div className="absolute bottom-10 right-10 z-20">
          <button 
            onClick={handleReplay}
            className="px-6 py-2 bg-transparent text-[rgba(255,215,0,0.5)] border border-[rgba(255,215,0,0.3)] rounded-full hover:text-[#ffd700] hover:bg-[rgba(255,215,0,0.1)] hover:border-[#ffd700] transition-colors duration-300"
          >
            Replay Animation
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
