import React from 'react';
import ChristmasTree from './components/ChristmasTree';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden font-sans">
      <ChristmasTree />
    </div>
  );
}

export default App;
