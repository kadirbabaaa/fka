import { useEffect, useRef, useState } from 'react';

export function useDevMode() {
    const [isDevMode, setIsDevMode] = useState(false);
    const keySequenceRef = useRef('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            keySequenceRef.current += e.key;
            if (keySequenceRef.current.length > 10) {
                keySequenceRef.current = keySequenceRef.current.slice(-10);
            }
            if (keySequenceRef.current.toLowerCase().includes('admin')) {
                setIsDevMode(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleLogoClick = () => {
        setIsDevMode(prev => {
            // 4 tıklamayı dışarıda saymak yerine burada basit toggle
            return prev;
        });
    };

    // Click counter ayrı tutulur, bileşen içinde kullanılır
    return { isDevMode, activateDevMode: () => setIsDevMode(true) };
}
