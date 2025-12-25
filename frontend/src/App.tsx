import React, { useState, useRef, useCallback, useEffect } from 'react';
import ChristmasTree, { ChristmasTreeHandle } from './components/ChristmasTree';
import MerryChristmas from './components/MerryChristmas';
import Music from './components/Music.tsx';
import WarningPage from './components/WarningPage';
import Snow from './components/Snow';
import WarmWish from './components/WarmWish';

const App: React.FC = () => {
  const [started, setStarted] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showReplay, setShowReplay] = useState(false);
  
  const treeRef = useRef<ChristmasTreeHandle>(null);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const handleReplay = () => {
    setShowText(false);
    setShowReplay(false);
    if (treeRef.current) {
      treeRef.current.reset();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTextComplete = useCallback(() => {
    setShowReplay(true);
  }, []);

  useEffect(() => {
    if (!showText) return;

    let animationFrameId: number;

    const updateStyles = () => {
      const scrollY = window.scrollY;
      const height = window.innerHeight;

      // Tree styles
      if (treeContainerRef.current) {
        const opacity = Math.max(0.3, 1 - scrollY / (height * 0.8));
        const scale = Math.max(0.5, 1 - scrollY / (height * 1.5));
        treeContainerRef.current.style.opacity = opacity.toString();
        treeContainerRef.current.style.transform = `scale(${scale})`;
      }

      // Scroll indicator styles
      if (scrollIndicatorRef.current) {
        const opacity = Math.max(0, 1 - scrollY / 200);
        scrollIndicatorRef.current.style.opacity = opacity.toString();
      }

      // Text styles
      if (textContainerRef.current) {
        // Define animation parameters
        const startY = height * 0.4;
        const endY = height * 0.1;
        const scrollDistance = height; // Scroll distance to complete movement (100vh)

        // Calculate progress (0 to 1) based on scroll position
        const progress = Math.min(1, scrollY / scrollDistance);

        // Interpolate between start and end positions
        const currentY = startY + (endY - startY) * progress;
        
        textContainerRef.current.style.transform = `translateY(${currentY}px)`;
      }

      animationFrameId = requestAnimationFrame(updateStyles);
    };

    // Start the animation loop
    updateStyles();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [showText]);

  return (
    <div className={`relative w-full bg-[#050505] font-sans ${showText ? 'min-h-screen overflow-y-auto' : 'h-screen overflow-hidden'}`}>
      <Snow />
      {!started ? (
        <WarningPage onComplete={() => setStarted(true)} />
      ) : (
        <>
          {/* Fixed Background Tree */}
          <div 
            ref={treeContainerRef}
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
            style={{ 
                zIndex: 0,
                opacity: 1,
                transform: 'scale(1)'
            }}
          >
             <ChristmasTree ref={treeRef} onAnimationComplete={() => setShowText(true)} />
          </div>

          {/* Fixed UI Elements */}
          <Music />
          {showReplay && (
            <div className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-20">
                <button 
                  onClick={handleReplay}
                  className="px-4 py-1 md:px-6 md:py-2 text-sm md:text-base bg-transparent text-[rgba(255,215,0,0.5)] border border-[rgba(255,215,0,0.3)] rounded-full hover:text-[#ffd700] hover:bg-[rgba(255,215,0,0.1)] hover:border-[#ffd700] transition-colors duration-300"
                >
                  Replay Animation
                </button>
            </div>
          )}
          
          {showText && (
              <div 
                ref={scrollIndicatorRef}
                className="fixed bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50 text-sm z-20"
              >
                  Scroll Down ▼
              </div>
          )}

          {/* Parallax Text */}
          {showText && (
            <div 
                ref={textContainerRef}
                className="fixed top-0 left-0 w-full z-30 pointer-events-none flex justify-center will-change-transform"
                style={{ 
                    transform: 'translateY(10vh)'
                }}
            >
                <MerryChristmas onComplete={handleTextComplete} />
            </div>
          )}

          {/* Scrollable Content */}
          <div className="relative z-10 w-full">
            {/* Spacer to allow scrolling before WarmWish appears */}
            <div className="h-[120vh] w-full"></div>

            {showText && <WarmWish />}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
