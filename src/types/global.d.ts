import type { BoxProps } from '../components/box.ts';
import type { GameProps } from '../game.ts';

declare module '*.css';

declare global {
  interface Window {
    currentPlayer: Player
  }

  type RGB = [number, number, number];
  type Color = 'NONE' | 'RED' | 'GREEN' | 'BLUE';

  type Player = 'player1' | 'player2';

  interface GameObject {
    onDraw: () => void;
    onUpdate?: () => void;
    onMousePressed?: () => void;
  }
}

export {};
