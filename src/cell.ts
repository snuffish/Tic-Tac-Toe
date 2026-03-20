import { CELL_SIZE } from './game.ts';
import type p5 from 'p5';

export type CellStateProps = {
  position: p5.Vector;
  enabled: boolean;
  markedByPlayer: Player | null;
  hover: boolean;
};

export type Cell = ReturnType<typeof cell>;
export const cell = (p: p5Instance, magicNumber: number) => {
  const state: CellStateProps = {
    position: p.createVector(0, 0),
    enabled: true,
    markedByPlayer: null,
    hover: false
  };

  const display = () => {
    p.push();
    if (state.hover && !state.markedByPlayer) {
      p.fill('yellow');
    } else {
      p.fill('white');
    }
    p.square(state.position.x, state.position.y, CELL_SIZE);
    p.pop();

    if (state.markedByPlayer === null) {
      return null;
    }

    if (state.markedByPlayer === 'player1') {
      drawX(p, state.position);
    } else {
      drawO(p, state.position);
    }
  };

  const setPosition = (x: number, y: number) => {
    state.position = p.createVector(x, y);
  };

  const setMarkedByPlayer = (player: Player) => {
    if (!state.enabled) {
      return;
    }

    state.markedByPlayer = player;

    p.updateGameState();
  };

  const setHover = (hover: boolean) => {
    state.hover = hover;
  };

  const setEnabled = (enabled: boolean) => {
    state.enabled = enabled;
  };

  const getCenterOriginPosition = () => {
    return p.createVector(
      state.position.x + CELL_SIZE / 2,
      state.position.y + CELL_SIZE / 2
    );
  };

  return {
    magicNumber,
    get centerOriginPosition() {
      return getCenterOriginPosition()
    },
    setMarkedByPlayer,
    setEnabled,
    setHover,
    get position() {
      return state.position;
    },
    isHover() {
      return state.hover;
    },
    get markedByPlayer() {
      return state.markedByPlayer;
    },
    setPosition,
    display
  } as const;
};

const drawX = (p: p5Instance, position: p5.Vector) => {
  p.push();
  p.translate(position);

  const centerOrigin = CELL_SIZE / 2;
  const originOffset = centerOrigin / 2;

  p.stroke('red');

  p.line(
    centerOrigin - originOffset,
    originOffset,
    centerOrigin + originOffset,
    CELL_SIZE - originOffset
  );
  p.line(
    CELL_SIZE - originOffset,
    originOffset,
    originOffset,
    CELL_SIZE - originOffset
  );
  p.pop();
};

const drawO = (p: p5Instance, position: p5.Vector) => {
  p.push();
  p.translate(position);

  p.stroke('blue');

  const centerOrigin = CELL_SIZE / 2;
  const diameter = CELL_SIZE / 2;

  p.circle(centerOrigin, centerOrigin, diameter);
  p.pop();
};
