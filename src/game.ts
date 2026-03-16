import p5 from 'p5';

const SQUARE_SIZE = 50;

const CANVAS_HEIGHT = SQUARE_SIZE * 3;
const CANVAS_WIDTH = SQUARE_SIZE * 3;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.background(240);
  };

  const drawX = (x: number, y: number) => {
    p.push();
    p.translate(x, y);

    const centerOrigin = SQUARE_SIZE / 2;
    const originOffset = centerOrigin / 2;

    p.stroke('red');

    p.line(
      centerOrigin - originOffset,
      originOffset,
      centerOrigin + originOffset,
      SQUARE_SIZE - originOffset
    );
    p.line(
      SQUARE_SIZE - originOffset,
      originOffset,
      originOffset,
      SQUARE_SIZE - originOffset
    );
    p.pop();
  };

  const drawO = (x: number, y: number) => {
    p.push();
    p.translate(x, y);

    p.stroke('blue');

    const centerOrigin = SQUARE_SIZE / 2;
    const diameter = SQUARE_SIZE / 2;

    p.circle(centerOrigin, centerOrigin, diameter);
    p.pop();
  };

  let currentPlayer: Player = 'player1';

  const board = [
    ['X', 'O', ''],
    ['', '', ''],
    ['', '', '']
  ];

  const nextTurn = () => {
    currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
  }

  p.mousePressed = () => {
    const row = p.floor(p.map(p.mouseY, 0, CANVAS_HEIGHT, 0, 3));
    const col = p.floor(p.map(p.mouseX, 0, CANVAS_WIDTH, 0, 3));

    if (board[row][col] === '') {
      const symbol = currentPlayer === 'player1' ? 'X' : 'O';
      board[row][col] = symbol;
      nextTurn();
    }
  };

  p.draw = () => {
    p.background(240);

    board.map((row, rowIndex) => {
      row.map((cell, cellIndex) => {
        const cellPos = cellIndex;

        const size = SQUARE_SIZE;

        const x = cellPos * size;
        const y = rowIndex * size;

        p.square(x, y, size);

        if (cell === 'X') {
          drawX(x, y);
        } else if (cell === 'O') {
          drawO(x, y);
        }
      });
    });
  };
};

export function mountSketch(container?: HTMLElement) {
  return new p5(sketch, container);
}
