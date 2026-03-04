import React, { useRef, useState } from 'react';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
}

export const Joystick: React.FC<JoystickProps> = ({ onMove }) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const handleMove = (clientX: number, clientY: number) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 50;

    const angle = Math.atan2(dy, dx);
    const clampedDistance = Math.min(distance, maxDistance);
    
    const x = Math.cos(angle) * clampedDistance;
    const y = Math.sin(angle) * clampedDistance;

    setKnobPos({ x, y });
    onMove(x / maxDistance, y / maxDistance);
  };

  const handleEnd = () => {
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  return (
    <div
      ref={joystickRef}
      className="w-32 h-32 rounded-full bg-stone-300/50 border-4 border-stone-400/50 flex items-center justify-center touch-none"
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onMouseMove={(e) => e.buttons === 1 && handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div
        className="w-16 h-16 rounded-full bg-stone-600 shadow-lg"
        style={{ transform: `translate(${knobPos.x}px, ${knobPos.y}px)` }}
      />
    </div>
  );
};
