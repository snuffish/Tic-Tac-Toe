import p5 from 'p5';
import type { GameStateProps } from './types';

declare module '*.css';

declare global {
  type p5Instance = p5 & {
    gameState: GameStateProps;
    updateGameState: () => void;
  };

  interface Window {
    p: p5Instance;
  }

  type RGB = [number, number, number];
  type Color = 'NONE' | 'RED' | 'GREEN' | 'BLUE';

  type Player = 'player1' | 'player2';
}

export {};
