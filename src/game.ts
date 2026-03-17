import p5 from 'p5';
import type { GameStateProps } from './types/types';
import { type Cell, cell } from './cell.ts';

export const CELL_SIZE = 50;
export const GAP_SIZE = 0;

export const CANVAS_HEIGHT = (CELL_SIZE + GAP_SIZE) * 3;
export const CANVAS_WIDTH = (CELL_SIZE + GAP_SIZE) * 3;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.background(240);
  };

  const gameState: GameStateProps = {
    currentPlayer: 'player1',
    board: [
      [cell(p, 2), cell(p, 7), cell(p, 6)],
      [cell(p, 9), cell(p, 5), cell(p, 1)],
      [cell(p, 4), cell(p, 3), cell(p, 8)]
    ]
  };

  const nextTurn = () => {
    gameState.currentPlayer =
      gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
  };

  const checkGameStatus = (): { winner: Player; cells: Cell[] } | null => {
    const checkBoard = (player: Player) => {
      const cells = gameState.board
        .flat()
        .filter((cell) => cell.markedByPlayer === player);
      const magicNumberSum = cells.reduce(
        (acc, cell) => acc + cell.magicNumber,
        0
      );

      return {
        magicNumberSum,
        cells
      };
    };

    const p1 = checkBoard('player1');
    if (p1.magicNumberSum === 15) {
      return { winner: 'player1', cells: p1.cells };
    }

    const p2 = checkBoard('player2');
    if (p2.magicNumberSum === 15) {
      return { winner: 'player2', cells: p2.cells };
    }

    return null;
  };

  const getCellByMousePosition = () => {
    const row = p.floor(p.map(p.mouseY, 0, CANVAS_HEIGHT, 0, 3));
    const col = p.floor(p.map(p.mouseX, 0, CANVAS_WIDTH, 0, 3));

    if (!gameState.board[row]?.[col]) {
      return null;
    }

    const cell = gameState.board[row][col];
    return [cell, row, col] as const;
  };

  p.mousePressed = () => {
    const hit = getCellByMousePosition();
    if (!hit) {
      return;
    }

    const [cell, row, col] = hit;

    if (cell.markedByPlayer === null) {
      cell.setMarkedByPlayer(gameState.currentPlayer);
      gameState.board[row][col] = cell;

      const status = checkGameStatus();
      if (status) {
        gameState.winner = {
          player: status.winner,
          cells: status.cells
        };
      } else {
        nextTurn();
      }
    }
  };

  p.mouseMoved = () => {
    // Clear previous hover
    gameState.board
      .flat()
      .filter((c) => c.isHover())
      .forEach((cell) => cell.setHover(false));

    const hit = getCellByMousePosition();
    if (!hit) {
      return;
    }

    const [cell] = hit;
    cell.setHover(true);
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

  const drawWinningRow = () => {
    if (!gameState.winner) {
      return;
    }

    const { cells } = gameState.winner;
  };

  p.draw = () => {
    if (gameState.winner) {
      gameState.board.flat().forEach((cell) => {
        cell.setHover(false);
        cell.setEnabled(false);
      });
    }

    gameState.board.map((row, rowIndex) => {
      row.map((cell, cellIndex) => {
        const x = cellIndex * CELL_SIZE;
        const y = rowIndex * CELL_SIZE;
        cell.setPosition(x, y);
        cell.draw();
      });
    });

    if (gameState.winner) {
      drawWinningRow();
      p.text('WINNER', 50, 50);
    }
  };
};

export function mountSketch(container?: HTMLElement) {
  return new p5(sketch, container);
}
