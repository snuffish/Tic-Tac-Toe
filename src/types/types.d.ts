import type { cell } from '../game.ts';

export type GameStateProps = {
  board: Cell[][];
  currentPlayer: Player;
  winner?: {
    player: Player;
    cells: Cell[];
  };
};

export type Cell = ReturnType<typeof cell>;
