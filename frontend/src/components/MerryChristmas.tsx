import React, { useEffect, useState } from 'react';

interface MerryChristmasProps {
    onComplete?: () => void;
}

const MerryChristmas: React.FC<MerryChristmasProps> = ({ onComplete }) => {
  const fullText = "Merry Christmas";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [onComplete]);

  return (
    <div 
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
    >
      <h1 
        className="text-7xl md:text-9xl text-[#ffd700] drop-shadow-[0_0_15px_rgba(255,215,0,0.6)] tracking-widest text-center select-none"
        style={{ fontFamily: "'Great Vibes', cursive", minHeight: '1.2em' }}
      >
        {displayedText}
      </h1>
    </div>
  );
};

export default MerryChristmas;
