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
        className="text-7xl md:text-9xl py-4 bg-gradient-to-r from-[#8E6E26] via-[#F8E698] to-[#8E6E26] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-widest text-center select-none"
        style={{ fontFamily: "'Great Vibes', cursive", minHeight: '1.5em', lineHeight: '1.5' }}
      >
        {displayedText}
      </h1>
    </div>
  );
};

export default MerryChristmas;
