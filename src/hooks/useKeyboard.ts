import React, { useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface UseKeyboardProps {
    isJoinedRef: React.MutableRefObject<boolean>;
    socket: Socket | null;
    audioCtxRef: React.MutableRefObject<AudioContext | null>;
}

/**
 * WASD + Arrow tuşlarıyla hareket, Space/E ile etkileşim.
 * keys ref'ini döndürür — game loop bunu her frame okur.
 */
export function useKeyboard({ isJoinedRef, socket, audioCtxRef }: UseKeyboardProps) {
    const keys = useRef({ w: false, a: false, s: false, d: false });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isJoinedRef.current) return;

            // AudioContext'i uyandır (ilk tuşa basışta)
            if (audioCtxRef.current?.state === 'suspended') {
                audioCtxRef.current.resume();
            }

            switch (e.key) {
                case 'w': case 'W': case 'ArrowUp': keys.current.w = true; break;
                case 'a': case 'A': case 'ArrowLeft': keys.current.a = true; break;
                case 's': case 'S': case 'ArrowDown': keys.current.s = true; break;
                case 'd': case 'D': case 'ArrowRight': keys.current.d = true; break;
                case ' ': case 'e': case 'E':
                    e.preventDefault(); // boşluk tuşu sayfayı kaydırmasın
                    socket?.emit('interact');
                    break;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (!isJoinedRef.current) return;
            switch (e.key) {
                case 'w': case 'W': case 'ArrowUp': keys.current.w = false; break;
                case 'a': case 'A': case 'ArrowLeft': keys.current.a = false; break;
                case 's': case 'S': case 'ArrowDown': keys.current.s = false; break;
                case 'd': case 'D': case 'ArrowRight': keys.current.d = false; break;
            }
        };

        // Pencere focus kaybedince tüm tuşları sıfırla (takılı kalma sorunu)
        const handleBlur = () => {
            keys.current = { w: false, a: false, s: false, d: false };
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', handleBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', handleBlur);
        };
    }, [socket]); // socket değişirse interact emit doğru socket'e gitsin

    return keys;
}
