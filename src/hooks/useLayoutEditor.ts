import { useCallback, useEffect, useRef, useState, MutableRefObject } from 'react';
import { Socket } from 'socket.io-client';
import { GameState } from '../../shared/types';
import {
  LayoutEditorState,
  snapToGrid,
  pixelToGridIndex,
  isGridCellOccupied,
} from '../renderer/drawLayoutEditor';

const MOVE_INTERACT_R = 75;

interface Params {
  socket: Socket | null;
  gameStateRef: MutableRefObject<GameState>;
  localPlayerRef: MutableRefObject<{ x: number; y: number }>;
  dayPhase: string;
}

const DEFAULT_STATE: LayoutEditorState = {
  isMoving: false,
  movingStationId: null,
  originalPos: null,
  previewPos: null,
  isPreviewValid: false,
};

export function useLayoutEditor({ socket, gameStateRef, localPlayerRef, dayPhase }: Params) {
  const [editorState, setEditorState] = useState<LayoutEditorState>(DEFAULT_STATE);
  const editorStateRef = useRef<LayoutEditorState>(DEFAULT_STATE);

  const setState = useCallback((next: LayoutEditorState) => {
    editorStateRef.current = next;
    setEditorState(next);
  }, []);

  // dayPhase prep → day geçişinde taşıma modunu iptal et
  useEffect(() => {
    if (dayPhase !== 'prep' && editorStateRef.current.isMoving) {
      const { movingStationId } = editorStateRef.current;
      if (movingStationId) socket?.emit('unlockStation', { stationId: movingStationId });
      setState(DEFAULT_STATE);
    }
  }, [dayPhase, socket, setState]);

  // Socket event'leri: stationMoved, stationLocked, stationUnlocked
  useEffect(() => {
    if (!socket) return;

    const onMoved = ({ stationId, x, y }: { stationId: string; x: number; y: number }) => {
      const gs = gameStateRef.current;
      if (gs.stationLayout[stationId]) {
        gs.stationLayout[stationId].x = x;
        gs.stationLayout[stationId].y = y;
      }
      // Fırın ise cookStations koordinatını da güncelle
      const oven = gs.cookStations?.find(s => s.id === stationId);
      if (oven) { oven.x = x; oven.y = y; }
    };

    const onLocked = ({ stationId, lockedBy }: { stationId: string; lockedBy: string }) => {
      const gs = gameStateRef.current;
      gs.lockedStations[stationId] = lockedBy;
    };

    const onUnlocked = ({ stationId }: { stationId: string }) => {
      const gs = gameStateRef.current;
      delete gs.lockedStations[stationId];
    };

    socket.on('stationMoved', onMoved as (...args: unknown[]) => void);
    socket.on('stationLocked', onLocked as (...args: unknown[]) => void);
    socket.on('stationUnlocked', onUnlocked as (...args: unknown[]) => void);
    return () => {
      socket.off('stationMoved', onMoved as (...args: unknown[]) => void);
      socket.off('stationLocked', onLocked as (...args: unknown[]) => void);
      socket.off('stationUnlocked', onUnlocked as (...args: unknown[]) => void);
    };
  }, [socket, gameStateRef]);

  // Önizleme pozisyonunu oyuncu hareketiyle güncelle — her zaman çalışır, isMoving kontrolü içeride
  useEffect(() => {
    const interval = setInterval(() => {
      const state = editorStateRef.current;
      if (!state.isMoving || !state.movingStationId) return;
      const { x, y } = localPlayerRef.current;
      const snapped = snapToGrid(x, y);
      const { col, row } = pixelToGridIndex(snapped.x, snapped.y);
      const gs = gameStateRef.current;
      const valid = !isGridCellOccupied(col, row, gs.stationLayout, state.movingStationId);
      // Sadece değişmişse güncelle
      if (state.previewPos?.x !== snapped.x || state.previewPos?.y !== snapped.y || state.isPreviewValid !== valid) {
        setState({ ...state, previewPos: snapped, isPreviewValid: valid });
      }
    }, 50);
    return () => clearInterval(interval);
  }, [localPlayerRef, gameStateRef, setState]); // dependency'den isMoving çıkarıldı

  const handleInteract = useCallback(() => {
    if (dayPhase !== 'prep') return;
    const gs = gameStateRef.current;
    const player = gs.players[socket?.id ?? ''];
    const lp = localPlayerRef.current;

    // Taşıma modu aktifse → bırak
    if (editorStateRef.current.isMoving) {
      const { movingStationId } = editorStateRef.current;
      if (!movingStationId) return;
      const { x, y } = localPlayerRef.current;
      const snapped = snapToGrid(x, y);
      const { col, row } = pixelToGridIndex(snapped.x, snapped.y);
      const valid = !isGridCellOccupied(col, row, gs.stationLayout, movingStationId);
      if (!valid) {
        console.log('[LayoutEditor] Hedef dolu, bırakma reddedildi');
        return;
      }
      console.log('[LayoutEditor] moveStation emit:', movingStationId, snapped);
      socket?.emit('moveStation', { stationId: movingStationId, x: snapped.x, y: snapped.y });
      setState(DEFAULT_STATE);
      return;
    }

    // Elde nesne varsa taşıma başlatma
    if (player?.holding) return;

    // En yakın taşınabilir istasyonu bul (counter'lar hariç — duvara sabit)
    let closest: { id: string; dist: number } | null = null;
    const layout = gs.stationLayout as Record<string, { id: string; x: number; y: number }>;
    for (const [id, pos] of Object.entries(layout)) {
      // Counter'lar ve plate_stack taşınamaz
      if (id.startsWith('counter') || id === 'plate_stack') continue;
      // Kilitli istasyonları atla
      if (gs.lockedStations[id]) continue;
      const dist = Math.hypot(lp.x - pos.x, lp.y - pos.y);
      if (dist < MOVE_INTERACT_R && (!closest || dist < closest.dist)) {
        closest = { id, dist };
      }
    }
    if (!closest) return;

    // Taşıma modunu başlat
    const stationId = closest.id;
    const pos = gs.stationLayout[stationId];
    socket?.emit('lockStation', { stationId });
    const snapped = snapToGrid(lp.x, lp.y);
    const { col, row } = pixelToGridIndex(snapped.x, snapped.y);
    const valid = !isGridCellOccupied(col, row, gs.stationLayout, stationId);
    setState({
      isMoving: true,
      movingStationId: stationId,
      originalPos: { x: pos.x, y: pos.y },
      previewPos: snapped,
      isPreviewValid: valid,
    });
  }, [dayPhase, socket, gameStateRef, localPlayerRef, setState]);

  const handleCancel = useCallback(() => {
    const { movingStationId } = editorStateRef.current;
    if (!movingStationId) return;
    socket?.emit('unlockStation', { stationId: movingStationId });
    setState(DEFAULT_STATE);
  }, [socket, setState]);

  return { editorState, editorStateRef, handleInteract, handleCancel };
}
