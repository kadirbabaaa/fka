import React from 'react';

interface DPadProps {
  onMove: (x: number, y: number) => void;
}

export const Joystick: React.FC<DPadProps> = ({ onMove }) => {
  const handleDirection = (x: number, y: number) => {
    onMove(x, y);
    console.log('D-pad:', x, y);
  };

  const buttonClass = "w-16 h-16 bg-stone-600 hover:bg-stone-700 active:bg-stone-800 text-white rounded-lg shadow-lg flex items-center justify-center text-2xl font-bold border-2 border-stone-500 touch-none select-none";

  return (
    <div className="grid grid-cols-3 gap-2 w-52 h-52 touch-none select-none">
      {/* Top row */}
      <div></div>
      <button
        className={buttonClass}
        onTouchStart={(e) => { e.preventDefault(); handleDirection(0, -1); }}
        onTouchEnd={(e) => { e.preventDefault(); handleDirection(0, 0); }}
        onMouseDown={() => handleDirection(0, -1)}
        onMouseUp={() => handleDirection(0, 0)}
        onMouseLeave={() => handleDirection(0, 0)}
      >
        ↑
      </button>
      <div></div>

      {/* Middle row */}
      <button
        className={buttonClass}
        onTouchStart={(e) => { e.preventDefault(); handleDirection(-1, 0); }}
        onTouchEnd={(e) => { e.preventDefault(); handleDirection(0, 0); }}
        onMouseDown={() => handleDirection(-1, 0)}
        onMouseUp={() => handleDirection(0, 0)}
        onMouseLeave={() => handleDirection(0, 0)}
      >
        ←
      </button>
      <div className="w-16 h-16 bg-stone-400/50 rounded-lg border-2 border-stone-500 flex items-center justify-center">
        <div className="w-8 h-8 bg-stone-600 rounded-full"></div>
      </div>
      <button
        className={buttonClass}
        onTouchStart={(e) => { e.preventDefault(); handleDirection(1, 0); }}
        onTouchEnd={(e) => { e.preventDefault(); handleDirection(0, 0); }}
        onMouseDown={() => handleDirection(1, 0)}
        onMouseUp={() => handleDirection(0, 0)}
        onMouseLeave={() => handleDirection(0, 0)}
      >
        →
      </button>

      {/* Bottom row */}
      <div></div>
      <button
        className={buttonClass}
        onTouchStart={(e) => { e.preventDefault(); handleDirection(0, 1); }}
        onTouchEnd={(e) => { e.preventDefault(); handleDirection(0, 0); }}
        onMouseDown={() => handleDirection(0, 1)}
        onMouseUp={() => handleDirection(0, 0)}
        onMouseLeave={() => handleDirection(0, 0)}
      >
        ↓
      </button>
      <div></div>
    </div>
  );
};
