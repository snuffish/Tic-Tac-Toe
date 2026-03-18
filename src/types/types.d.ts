import type { Cell, cell } from '../cell.ts';

export type GameStateProps = {
  board: {
    position: { x: number; y: number };
    cells: Cell[][];
  };
  currentPlayer: Player;
  winner?: {
    player: Player;
    cells: Cell[];
  };
};
