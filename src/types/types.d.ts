import type { cell } from '../game.ts';

export type CellStateProps = {
  x: number;
  y: number;
  markedByPlayer: Player | null;
};

export type GameStateProps = {
  currentPlayer: Player;
  winner?: {
    player: Player;
    cells: Cell[];
  };
};

export type Cell = ReturnType<typeof cell>;
