import React, { useRef, useState } from 'react';
import { COLORS, HATS } from './types/game';
import { MARKET_NAME } from './constants';
import { useSocket } from './hooks/useSocket';
import { useKeyboard } from './hooks/useKeyboard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CharacterSelect } from './components/CharacterSelect';
import { GameScreen } from './components/GameScreen';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const localPlayerRef = useRef({ x: 400, y: 300 });

  // isJoinedRef en başta — useKeyboard ve useSocket bunu kullanır
  const isJoinedRef = useRef(false);

  // Socket + game state
  const { socket, isConnected, myId, gameStateRef, audioCtxRef } = useSocket(localPlayerRef);

  // Klavye kontrolü (WASD + ok tuşları)
  const keysRef = useKeyboard({ isJoinedRef, socket, audioCtxRef });

  // UI state
  const [showWelcome, setShowWelcome] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  // Karakter seçimi
  const [playerName, setPlayerName] = useState('');
  const [marketName, setMarketName] = useState(MARKET_NAME);
  const [playerColor, setPlayerColor] = useState(COLORS[0]);
  const [playerHat, setPlayerHat] = useState(HATS[0]);
  const [roomId, setRoomId] = useState('terramarket'); // Tek Oda Sistemi

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !socket) return;
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();

    socket.emit('join', {
      name: playerName.trim(),
      color: playerColor,
      hat: playerHat,
      roomId: roomId.trim().toLowerCase() || 'default',
      marketName: marketName.trim() || MARKET_NAME,
    });

    isJoinedRef.current = true;
    setIsJoined(true);
  };

  // ── Ekranlar ─────────────────────────────────────────────────────────────

  if (!isJoined) {
    if (showWelcome) {
      return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
    }

    return (
      <CharacterSelect
        isConnected={isConnected}
        playerName={playerName} setPlayerName={setPlayerName}
        playerColor={playerColor} setPlayerColor={setPlayerColor}
        playerHat={playerHat} setPlayerHat={setPlayerHat}
        marketName={marketName} setMarketName={setMarketName}
        roomId={roomId} setRoomId={setRoomId}
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
