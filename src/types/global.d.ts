import type { BoxProps } from '../components/box.ts';
import type { GameProps } from '../game.ts';

declare module '*.css';

declare global {
  interface Window {
    mousePressed: boolean;
    currentPlayer: Player;
    gameWinner: Player | null;
    game: GameProps | null
  }

  interface DocumentEventMap {
    onMousePressed: void;
    onMouseReleased: void;
    onBoxPressed: CustomEvent<{
      boxNr: BoxProps['nr'];
      player: Player;
    }>;
    onBoxReset: CustomEvent<{
      boxNr: BoxProps['nr'];
    }>;
    onGameReset: void;
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
