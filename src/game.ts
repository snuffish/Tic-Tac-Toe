import p5 from 'p5';
import { CANVAS_HEIGHT, CANVAS_WIDTH, magicSquareArray } from './env.ts';
import { Cell } from './components/cell.ts';
import { Board } from './components/board.ts';

const sketch = (p: p5) => {
  let cells: Cell[] = [];
  let board: Board

  p.setup = () => {
    window.currentPlayer = 'player1'
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.background(240);

    cells = magicSquareArray.map((nr) => new Cell(p, nr));

    board = new Board()
    board.addCell(cells)
  };

  p.draw = () => {
    p.background(240);

    cells.forEach((cell) => cell.show());
  };
};

export function mountSketch(container?: HTMLElement) {
  return new p5(sketch, container);
}
