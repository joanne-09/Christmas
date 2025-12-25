import React, { useEffect, useState } from 'react';

interface WarningPageProps {
  onComplete: () => void;
}

const WarningPage: React.FC<WarningPageProps> = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Start fade out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 2500);

    // Complete after 3.5 seconds (allowing 1s for fade out)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-1000"
      style={{ opacity }}
    >
      <div className="text-center">
        <h3 className="text-lg md:text-xl font-serif text-[#8b7355] mb-3 animate-pulse tracking-widest">
            Please Enable Sound for the Best Experience
        </h3>
      </div>
    </div>
  );
};

export default WarningPage;
