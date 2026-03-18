import type { cell } from '../cell.ts';

export type GameStateProps = {
  board: {
    position: { x: number; y: number };
    cells: Cell[][];
  };
  currentPlayer: Player;
  winner?: {
    player: Player;
  };
};
