import type { cell } from '../cell.ts';

export type GameStateProps = {
  board: Cell[][];
  currentPlayer: Player;
  winner?: {
    player: Player;
    cells: Cell[];
  };
};
