import React, { useEffect, useRef, useState, useCallback } from 'react';

const Music: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.volume = 0.3;
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.log("Autoplay prevented. Waiting for user interaction.");
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    tryPlay();

    // Retry on first user gesture (covers mobile + desktop)
    const handler = () => {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        tryPlay();
      }
    };

    const interactionEvents: Array<keyof DocumentEventMap> = ['pointerdown', 'touchstart', 'keydown'];
    interactionEvents.forEach((event) => document.addEventListener(event, handler, { once: true }));

    return () => {
      interactionEvents.forEach((event) => document.removeEventListener(event, handler));
    };
  }, [tryPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      tryPlay();
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50">
        <audio ref={audioRef} loop autoPlay preload="auto" playsInline>
          <source src={`${import.meta.env.BASE_URL}mistletoe.mp3`} type="audio/mpeg" />
        </audio>
        <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={togglePlay}
            className="text-[#ffd700] hover:text-[#fff] transition-colors p-2 bg-black/20 rounded-full backdrop-blur-sm"
            title={isPlaying ? "Pause Music" : "Play Music"}
        >
            {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                </svg>
            )}
        </button>
    </div>
  );
};

export default Music;
