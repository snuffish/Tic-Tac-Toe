import p5 from 'p5';
import { BOX_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH } from './env.ts';
import { Box } from './components/box.ts';
import { GameHud } from './components/game-hud.ts';
import { useGameStore } from './store.ts';
import type { PlayerKey } from './helper.ts';

const GRID_SIZE = 3;
const BOX_GAP = 1;
const MAX_ACTIVE_BOXES_PER_PLAYER = 3;

type Cell = PlayerKey | null;
type Board = Cell[][];
type MatchStatus =
  | { state: 'playing' }
  | { state: 'won'; winner: PlayerKey; cells: Array<[number, number]> }
  | { state: 'draw' };

export type GameProps = ReturnType<typeof Game>;

const Game = (p: p5) => {
  const getCellPosition = (boxNr: number) => {
    const row = Math.floor(boxNr / GRID_SIZE);
    const col = boxNr % GRID_SIZE;

    return { row, col };
  };

  const getBoardOrigin = () => {
    const containerWidth = GRID_SIZE * BOX_SIZE + (GRID_SIZE - 1) * BOX_GAP;
    const containerHeight = GRID_SIZE * BOX_SIZE + (GRID_SIZE - 1) * BOX_GAP;

    return {
      originX: (CANVAS_WIDTH - containerWidth) / 2,
      originY: (CANVAS_HEIGHT - containerHeight) / 2
    };
  };

  const createBoxes = (originX: number, originY: number) => {
    return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
      const { row, col } = getCellPosition(i);

      const x = originX + col * (BOX_SIZE + BOX_GAP);
      const y = originY + row * (BOX_SIZE + BOX_GAP);

      return Box(p, {
        nr: i,
        x,
        y,
        diameter: BOX_SIZE
      });
    });
  };

  const createBoard = (): Board =>
    Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => null)
    );

  const getWinningLines = (): Array<Array<[number, number]>> => {
    const rows = Array.from({ length: GRID_SIZE }, (_, row) =>
      Array.from(
        { length: GRID_SIZE },
        (_, col) => [row, col] as [number, number]
      )
    );

    const cols = Array.from({ length: GRID_SIZE }, (_, col) =>
      Array.from(
        { length: GRID_SIZE },
        (_, row) => [row, col] as [number, number]
      )
    );

    const mainDiagonal = Array.from(
      { length: GRID_SIZE },
      (_, i) => [i, i] as [number, number]
    );

    const antiDiagonal = Array.from(
      { length: GRID_SIZE },
      (_, i) => [i, GRID_SIZE - 1 - i] as [number, number]
    );

    return [...rows, ...cols, mainDiagonal, antiDiagonal];
  };

  const isBoardFull = (currentBoard: Board) =>
    currentBoard.every((row) => row.every((cell) => cell !== null));

  const getWinner = (currentBoard: Board) => {
    const winningLines = getWinningLines();

    for (const line of winningLines) {
      const [firstRow, firstCol] = line[0];
      const firstCell = currentBoard[firstRow][firstCol];

      if (firstCell === null) continue;

      const isWinningLine = line.every(
        ([row, col]) => currentBoard[row][col] === firstCell
      );

      if (isWinningLine) {
        return {
          winner: firstCell,
          cells: line
        } as const;
      }
    }

    return null;
  };

  const getMatchStatus = (currentBoard: Board): MatchStatus => {
    const winningResult = getWinner(currentBoard);

    if (winningResult !== null) {
      return {
        state: 'won',
        winner: winningResult.winner,
        cells: winningResult.cells
      };
    }

    if (isBoardFull(currentBoard)) {
      return { state: 'draw' };
    }

    return { state: 'playing' };
  };

  const { originX, originY } = getBoardOrigin();
  const boxes = createBoxes(originX, originY);

  let board = createBoard();

  const playerMoves = {
    player1: [] as number[],
    player2: [] as number[]
  };

  let matchStatus: MatchStatus = { state: 'playing' };

  const resetGame = () => {
    p.noLoop();
    board = createBoard();
    playerMoves.player1.length = 0;
    playerMoves.player2.length = 0;
    matchStatus = { state: 'playing' };

    const { actions } = useGameStore.getState();
    actions.setCurrentPlayer('player1');
    actions.setGameWinner(null);
    actions.setMousePressed(false);
    actions.triggerGameReset();

    p.loop();
  };

  const checkMatchStatus = () => {
    matchStatus = getMatchStatus(board);

    if (matchStatus.state === 'won') {
      console.log(`Winner: ${matchStatus.winner}`);
      useGameStore.getState().actions.setGameWinner(matchStatus.winner);
      // p.noLoop();
      return;
    }

    if (matchStatus.state === 'draw') {
      console.log('Draw');
    }
  };

  const hud = GameHud(p);

  const render = () => {
    boxes.forEach((item) => {
      item.onUpdate?.();
      item.onDraw();
    });

    hud.onUpdate?.();
    hud.onDraw();
  };

  useGameStore.subscribe((state, prevState) => {
    if (
      state.lastBoxPressed !== prevState.lastBoxPressed &&
      state.lastBoxPressed
    ) {
      if (matchStatus.state !== 'playing') return;

      const { player, boxNr } = state.lastBoxPressed;
      const { row, col } = getCellPosition(boxNr);

      if (board[row][col] !== null) return;

      board[row][col] = player;
      playerMoves[player].push(boxNr);

      if (playerMoves[player].length > MAX_ACTIVE_BOXES_PER_PLAYER) {
        const oldestBoxNr = playerMoves[player].shift();

        if (oldestBoxNr !== undefined) {
          const oldestCell = getCellPosition(oldestBoxNr);
          board[oldestCell.row][oldestCell.col] = null;
          useGameStore.getState().actions.triggerBoxReset(oldestBoxNr);
        }
      }

      checkMatchStatus();
    }
  });

  return {
    render,
    resetGame
  };
};

const sketch = (p: p5) => {
  const game = Game(p);


  p.setup = () => {
    const slider = p.createSlider(0, 100, 50);
    slider.position(50, 50)

    const root = p.createDiv('Root')
    const section = p.createDiv('section');

    root.child(section)

    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.background(240);
    const { actions } = useGameStore.getState();
    actions.setCurrentPlayer('player1');
    actions.setGameWinner(null);
    actions.setGameInstance(game);
  };

  p.draw = () => {
    p.push();
    p.background(240);
    game.render();
    p.pop();
  };

  p.mousePressed = () => {
    p.noLoop();
    useGameStore.getState().actions.setMousePressed(true);
  };

  p.mouseReleased = () => {
    p.loop();
    useGameStore.getState().actions.setMousePressed(false);
  };

  p.keyPressed = () => {
    if (p.key === 'r' || p.key === 'R') {
      game.resetGame();
    }
  };
};

export function mountSketch(container?: HTMLElement) {
  return new p5(sketch, container);
}
