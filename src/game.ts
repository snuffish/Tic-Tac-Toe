import p5 from 'p5';
import type { GameStateProps } from './types/types';
import { type Cell, cell } from './cell.ts';

export const CELL_SIZE = 50;
export const GAP_SIZE = 0;

const BOARD_WIDTH = (CELL_SIZE + GAP_SIZE) * 3;
const BOARD_HEIGHT = (CELL_SIZE + GAP_SIZE) * 3;
const BOARD_PADDING = 10;

const CANVAS_WIDTH = BOARD_WIDTH + 100;
const CANVAS_HEIGHT = BOARD_HEIGHT + 100;

export const checkGameStatus = (
  gameState: GameStateProps
): GameStateProps['winner'] | null => {
  const horizontalCheck = (row: number, player: Player) => {
    const cells = [0, 1, 2].map((col) => gameState.board.cells[row][col]);
    return cells.every((cell) => cell.markedByPlayer === player) ? cells : null;
  };

  const verticalCheck = (col: number, player: Player) => {
    const cells = [0, 1, 2].map((row) => gameState.board.cells[row][col]);
    return cells.every((cell) => cell.markedByPlayer === player) ? cells : null;
  };

  const diagonalCheck = (player: Player) => {
    const topLeftToBottomRight = [0, 1, 2].map(
      (i) => gameState.board.cells[i][i]
    );
    if (topLeftToBottomRight.every((cell) => cell.markedByPlayer === player)) {
      return topLeftToBottomRight;
    }

    const topRightToBottomLeft = [0, 1, 2].map(
      (i) => gameState.board.cells[i][2 - i]
    );
    if (topRightToBottomLeft.every((cell) => cell.markedByPlayer === player)) {
      return topRightToBottomLeft;
    }

    return null;
  };

  for (const player of ['player1', 'player2'] as const) {
    for (let row = 0; row <= 2; row++) {
      const cells = horizontalCheck(row, player);
      if (cells) {
        return {
          player,
          cells
        };
      }
    }

    for (let col = 0; col <= 2; col++) {
      const cells = verticalCheck(col, player);
      if (cells) {
        return {
          player,
          cells
        };
      }
    }

    const cells = diagonalCheck(player);
    if (cells) {
      return {
        player,
        cells
      };
    }
  }

  return null;
};

const sketch = (p: p5Instance) => {
  const updateGameState = () => {
    const winnerStatus = checkGameStatus(gameState);
    if (winnerStatus) {
      gameState.winner = winnerStatus;
    } else {
      nextTurn();
    }
  };

  const gameState: GameStateProps = {
    currentPlayer: 'player1',
    board: {
      position: { x: 20, y: 40 },
      cells: [
        [cell(p, 2), cell(p, 7), cell(p, 6)],
        [cell(p, 9), cell(p, 5), cell(p, 1)],
        [cell(p, 4), cell(p, 3), cell(p, 8)]
      ]
    }
  };

  p.gameState = gameState;
  p.updateGameState = updateGameState;


  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.background(240);
    
    // gameState.board.cells[0][0].setMarkedByPlayer('player1');
    // gameState.board.cells[0][1].setMarkedByPlayer('player1');
    // gameState.board.cells[0][2].setMarkedByPlayer('player1');
  };

  const nextTurn = () => {
    gameState.currentPlayer =
      gameState.currentPlayer === 'player1' ? 'player2' : 'player1';
  };

  const getCellByMousePosition = () => {
    const localX = p.mouseX - gameState.board.position.x;
    const localY = p.mouseY - gameState.board.position.y;

    if (
      localX < 0 ||
      localY < 0 ||
      localX >= BOARD_WIDTH ||
      localY >= BOARD_HEIGHT
    ) {
      return null;
    }

    const col = p.floor(localX / CELL_SIZE);
    const row = p.floor(localY / CELL_SIZE);

    const cell = gameState.board.cells[row]?.[col];
    if (!cell) {
      return null;
    }

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
      gameState.board.cells[row][col] = cell;

      updateGameState();
    }
  };

  const clearHover = () => {
    gameState.board.cells
      .flat()
      .filter((c) => c.isHover())
      .forEach((cell) => cell.setHover(false));
  };

  p.mouseMoved = () => {
    // Clear previous hover
    clearHover();

    const hit = getCellByMousePosition();
    if (!hit) {
      return;
    }

    const [cell] = hit;
    cell.setHover(true);
  };

  const drawLine = (cells: Cell[]) => {
    const xArr = cells.map((cell) => cell.position.x);
    const yArr = cells.map((cell) => cell.position.y);

    p.push();
    p.strokeWeight(3);
    // p.line(
    //   fromCell.position.x,
    //   fromCell.position.y,
    //   toCell.position.x,
    //   toCell.position.y
    // );
    p.pop();
  };

  const drawWinningRow = () => {
    if (!gameState.winner) {
      return;
    }

    const { player } = gameState.winner;
  };

  const displayBoard = () => {
    p.translate(gameState.board.position.x, gameState.board.position.y);

    gameState.board.cells.map((row, rowIndex) => {
      row.map((cell, cellIndex) => {
        const x = cellIndex * CELL_SIZE;
        const y = rowIndex * CELL_SIZE;
        cell.setPosition(x, y);
        cell.display();
      });
    });
  };

  p.draw = () => {
    if (gameState.winner) {
      gameState.board.cells.flat().forEach((cell) => {
        cell.setHover(false);
        cell.setEnabled(false);
      });
    }

    displayBoard();

    if (gameState.winner) {
      drawWinningRow();
      p.text('WINNER', 50, 50);
    }
  };
};

export function mountSketch(container?: HTMLElement) {
  // @ts-ignore
  return new p5(sketch, container);
}
