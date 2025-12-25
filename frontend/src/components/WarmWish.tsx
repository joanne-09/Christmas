import React, { useState } from 'react';

const WarmWish: React.FC = () => {
  const [warmWord, setWarmWord] = useState<string | null>(null);

  const fetchWarmWord = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/warm-word`);
      const data = await response.json();
      setWarmWord(data.word);
    } catch (error) {
      console.error("Failed to fetch warm word", error);
      setWarmWord("Merry Christmas and Happy New Year!");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start pt-[55vh] bg-transparent text-white relative z-30 pointer-events-none">
      {!warmWord ? (
        <button 
          onClick={fetchWarmWord}
          className="pointer-events-auto px-8 py-4 text-xl text-[#ffd700] bg-black/40 border border-[#ffd700]/40 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.1)] backdrop-blur-sm transition-all duration-100 hover:bg-[#ffd700]/10 hover:border-[#ffd700] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:scale-105 active:scale-95 tracking-widest"
        >
          Click for a Warm Christmas Wish
        </button>
      ) : (
        <div className="flex flex-col items-center text-center px-8 pb-8 animate-fade-in max-w-2xl mx-auto pointer-events-auto">
          <p className="text-3xl md:text-5xl font-serif text-[#ffd700] leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            "{warmWord}"
          </p>
          <button 
            onClick={fetchWarmWord}
            className="mt-12 px-6 py-2 text-sm text-gray-400 hover:text-white transition-colors border border-gray-700 rounded-full hover:border-gray-500"
          >
            Get another wish
          </button>
        </div>
      )}
    </div>
  );
};

export default WarmWish;
