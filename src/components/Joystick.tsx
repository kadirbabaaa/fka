import React, { useRef, useState, useCallback } from 'react';

interface JoystickProps {
  onMove: (x: number, y: number) => void;
}

export const Joystick: React.FC<JoystickProps> = ({ onMove }) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  // isDragging'i ref olarak tutuyoruz — closure içinde güncel değeri okumak için
  const isDraggingRef = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false); // sadece transition için

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 50;

    let finalX = dx;
    let finalY = dy;

    if (distance > maxDistance) {
      const angle = Math.atan2(dy, dx);
      finalX = Math.cos(angle) * maxDistance;
      finalY = Math.sin(angle) * maxDistance;
    }

    setKnobPos({ x: finalX, y: finalY });
    onMove(finalX / maxDistance, finalY / maxDistance);
  }, [onMove]);

  const handleEnd = useCallback(() => {
    isDraggingRef.current = false;
    setIsDraggingState(false);
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  }, [onMove]);

  // --- MOUSE (PC) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDraggingRef.current) return;
    isDraggingRef.current = true;
    setIsDraggingState(true);
    handleMove(e.clientX, e.clientY);

    const onMouseMove = (me: MouseEvent) => {
      me.preventDefault();
      handleMove(me.clientX, me.clientY);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      handleEnd();
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // --- TOUCH (Mobile) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isDraggingRef.current) return;
    isDraggingRef.current = true;
    setIsDraggingState(true);
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    // isDraggingRef kullanıyoruz — ref her zaman güncel değeri döner!
    if (isDraggingRef.current && e.touches[0]) {
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleEnd();
  };

  return (
    <div
      ref={joystickRef}
      className="w-32 h-32 rounded-full bg-stone-400/70 border-4 border-stone-600 flex items-center justify-center touch-none select-none cursor-pointer"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="w-16 h-16 rounded-full bg-stone-700 shadow-lg pointer-events-none"
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: isDraggingState ? 'none' : 'transform 0.2s ease-out',
        }}
      />
    </div>
  );
};
