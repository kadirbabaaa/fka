import { useEffect, useState } from 'react';
import { GameState, DAY_TICKS, Upgrades } from '../types/game';
import React from 'react';

export function useGameState(gameStateRef: React.MutableRefObject<GameState>) {
    const [score, setScore] = useState(0);
    const [dayPhase, setDayPhase] = useState<'prep' | 'day' | 'night'>('prep');
    const [dayTimer, setDayTimer] = useState(DAY_TICKS);
    const [upgrades, setUpgrades] = useState<Upgrades>({ patience: 0, earnings: 0, stockMax: 0 });
    const [day, setDay] = useState(1);
    const [ovenCount, setOvenCount] = useState(1);
    const [queueLen, setQueueLen] = useState(0);
    const [lives, setLives] = useState(3);
    const [isGameOver, setIsGameOver] = useState(false);
    const [menuChoices, setMenuChoices] = useState<string[] | null>(null);
    const [unlockedDishes, setUnlockedDishes] = useState<string[]>(['🥗', '🍔']);

    useEffect(() => {
        const id = setInterval(() => {
            const s = gameStateRef.current;
            setScore(s.score);
            setDayPhase(s.dayPhase);
            setDayTimer(s.dayTimer);
            setUpgrades({ ...s.upgrades });
            setDay(s.day);
            setQueueLen(s.waitList?.length ?? 0);
            setOvenCount(s.cookStations?.length ?? 1);
            setLives(s.lives ?? 3);
            setIsGameOver(s.isGameOver ?? false);
            setMenuChoices(s.menuChoices ?? null);
            setUnlockedDishes(s.unlockedDishes ?? ['🥗', '🍔']);
        }, 200);
        return () => clearInterval(id);
    }, []);

    return { score, dayPhase, dayTimer, upgrades, day, ovenCount, queueLen, lives, isGameOver, menuChoices, unlockedDishes };
}
