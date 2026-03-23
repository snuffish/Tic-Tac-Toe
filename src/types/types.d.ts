import p5 from 'p5';
import type { Cell, cell } from '../cell.ts';

export type GameStateProps = {
  textLabel: string;
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

export interface IComponent {
  onRegister?(p: p5): void;
  onUpdate(p: p5): void;
  onDisplay(p: p5): void;
}