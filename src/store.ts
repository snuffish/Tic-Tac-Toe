import { createStore } from 'zustand/vanilla';
import type { PlayerKey } from './helper.ts';
import type { GameProps } from './game.ts';

interface GameState {
  currentPlayer: PlayerKey;
  gameWinner: PlayerKey | null;
  mousePressed: boolean;
  gameInstance: GameProps | null;

  lastBoxPressed: { player: PlayerKey; boxNr: number; ts: number } | null;
  lastBoxReset: { boxNr: number; ts: number } | null;
  lastGameReset: number;

  actions: {
    setCurrentPlayer: (player: PlayerKey) => void;
    setGameWinner: (winner: PlayerKey | null) => void;
    setMousePressed: (pressed: boolean) => void;
    setGameInstance: (game: GameProps) => void;
    triggerBoxPressed: (player: PlayerKey, boxNr: number) => void;
    triggerBoxReset: (boxNr: number) => void;
    triggerGameReset: () => void;
  };
}

export const useGameStore = createStore<GameState>((set) => ({
  currentPlayer: 'player1',
  gameWinner: null,
  mousePressed: false,
  gameInstance: null,

  lastBoxPressed: null,
  lastBoxReset: null,
  lastGameReset: 0,

  actions: {
    setCurrentPlayer: (player) => set({ currentPlayer: player }),
    setGameWinner: (winner) => set({ gameWinner: winner }),
    setMousePressed: (pressed) => set({ mousePressed: pressed }),
    setGameInstance: (game) => set({ gameInstance: game }),
    triggerBoxPressed: (player, boxNr) =>
      set({ lastBoxPressed: { player, boxNr, ts: Date.now() } }),
    triggerBoxReset: (boxNr) =>
      set({ lastBoxReset: { boxNr, ts: Date.now() } }),
    triggerGameReset: () =>
      set({ lastGameReset: Date.now() }),
  },
}));
