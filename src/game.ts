import p5 from 'p5';
import type { Cell, CellStateProps, GameStateProps } from './types/types';

const SQUARE_SIZE = 50;

const CANVAS_HEIGHT = SQUARE_SIZE * 3;
const CANVAS_WIDTH = SQUARE_SIZE * 3;

const cell = (p: p5, magicNumber: number) => {
  const state: CellStateProps = {
    x: 0,
    y: 0,
    markedByPlayer: null
  };

  const draw = () => {
    if (state.markedByPlayer === null) {
      return null;
    }

    if (state.markedByPlayer === 'player1') {
      drawX(p, state.x, state.y);
    } else {
      drawO(p, state.x, state.y);
    }
  };

  const setPosition = (x: number, y: number) => {
    state.x = x;
    state.y = y;
  };

  return {
    magicNumber,
    setMarkedByPlayer: (player: Player) => {
      state.markedByPlayer = player;
    },
    get markedByPlayer() {
      return state.markedByPlayer;
    },
    setPosition,
    draw
  };
};

const drawX = (p: p5, x: number, y: number) => {
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

const drawO = (p: p5, x: number, y: number) => {
  p.push();
  p.translate(x, y);

  p.stroke('blue');

  const centerOrigin = SQUARE_SIZE / 2;
  const diameter = SQUARE_SIZE / 2;

  p.circle(centerOrigin, centerOrigin, diameter);
  p.pop();
};

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.background(240);
  };
  const gameState: GameStateProps = {
    currentPlayer: 'player1'
  };

  const board = [
    [cell(p, 2), cell(p, 7), cell(p, 6)],
    [cell(p, 9), cell(p, 5), cell(p, 1)],
    [cell(p, 4), cell(p, 3), cell(p, 8)]
  ];

  const nextTurn = () => {
    gameState.currentPlayer =
      gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
  };

  const checkGameStatus = (): { winner: Player | null; cells?: Cell[] } => {
    const checkBoard = (player: Player) => {
      const cells = board
        .flat()
        .filter((cell) => cell.markedByPlayer === player);
      const magicNumberSum = cells.reduce(
        (acc, cell) => acc + cell.magicNumber,
        0
      );

      return {
        magicNumberSum,
        cells
      } as const;
    };

    const p1 = checkBoard('player1');
    if (p1.magicNumberSum === 15) {
      return { winner: 'player1', cells: p1.cells };
    }

    const p2 = checkBoard('player2');
    if (p2.magicNumberSum === 15) {
      return { winner: 'player2', cells: p2.cells };
    }

    return { winner: null };
  };

  p.mousePressed = () => {
    const row = p.floor(p.map(p.mouseY, 0, CANVAS_HEIGHT, 0, 3));
    const col = p.floor(p.map(p.mouseX, 0, CANVAS_WIDTH, 0, 3));

    const boardCell = board[row][col];
    if (boardCell.markedByPlayer === null) {
      boardCell.setMarkedByPlayer(gameState.currentPlayer);
      board[row][col] = boardCell;
      const status = checkGameStatus();
      if (status.winner) {
        console.log('WINNER ==>', status.winner, 'CELLS===>', status.cells);
      }

      nextTurn();
    }
  };

  // const drawLine = () => {
  //   p.push();
  //   const vec1 = p.createVector(0);
  //   const vec2 = p.createVector(3 * SQUARE_SIZE, 3 * SQUARE_SIZE);
  //
  //   p.stroke('green')
  //   p.strokeWeight(3)
  //   p.line(vec1.x, vec1.y, vec2.x, vec2.y);
  //   p.pop();
  // };

  p.draw = () => {
    p.background(240);

    board.map((row, rowIndex) => {
      row.map((cell, cellIndex) => {
        const cellPos = cellIndex;

        const size = SQUARE_SIZE;

        const x = cellPos * size;
        const y = rowIndex * size;
        cell.setPosition(x, y);

        p.square(x, y, size);

        cell.draw();

        // drawLine();
      });
    });
  };
};

export function mountSketch(container?: HTMLElement) {
  return new p5(sketch, container);
}

export { cell };
