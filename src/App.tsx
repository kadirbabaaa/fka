import React, { useRef, useState } from 'react';
import { COLORS, CHARACTER_TYPES } from './types/game';
import { MARKET_NAME } from './constants';
import { useSocket } from './hooks/useSocket';
import { useKeyboard } from './hooks/useKeyboard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CharacterSelect } from './components/CharacterSelect';
import { GameScreen } from './components/GameScreen';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localPlayerRef = useRef({ x: 400, y: 300 });
  const isJoinedRef = useRef(false);

  const { socket, isConnected, myId, gameStateRef, audioCtxRef } = useSocket(localPlayerRef);
  const keysRef = useKeyboard({ isJoinedRef, socket, audioCtxRef });

  const [showWelcome, setShowWelcome] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  const [playerName, setPlayerName] = useState('');
  const [marketName, setMarketName] = useState(MARKET_NAME);
  const [charType, setCharType] = useState(0);
  const [playerColor, setPlayerColor] = useState(CHARACTER_TYPES[0].bodyColor);
  const [playerHat, setPlayerHat] = useState(CHARACTER_TYPES[0].hat);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !socket) return;
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();

    socket.emit('join', {
      name: playerName.trim(),
      color: playerColor,
      hat: playerHat,
      charType,
      roomId: 'terramarket',
      marketName: marketName.trim() || MARKET_NAME,
    });

    isJoinedRef.current = true;
    setIsJoined(true);
  };

  if (!isJoined) {
    if (showWelcome) return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;

    return (
      <CharacterSelect
        isConnected={isConnected}
        playerName={playerName} setPlayerName={setPlayerName}
        playerColor={playerColor} setPlayerColor={setPlayerColor}
        playerHat={playerHat} setPlayerHat={setPlayerHat}
        charType={charType} setCharType={setCharType}
        marketName={marketName} setMarketName={setMarketName}
        onJoin={handleJoin}
      />
    );
  }


  return (
    <GameScreen
      canvasRef={canvasRef}
      isJoined={isJoined}
      myId={myId}
      socket={socket}
      gameStateRef={gameStateRef}
      localPlayerRef={localPlayerRef}
      keysRef={keysRef}
      audioCtxRef={audioCtxRef}
    />
  );
}
