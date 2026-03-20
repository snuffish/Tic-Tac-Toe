import p5 from 'p5';
import type { Cell, cell } from '../cell.ts';

export type GameStateProps = {
  textLabel: string
  board: {
    position: p5.Vector;
    cells: Cell[][];
  };
  currentPlayer: Player;
  winner?: {
    player: Player;
    cells: Cell[];
  };
};
