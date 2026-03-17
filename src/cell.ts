import p5 from 'p5';
import { CELL_SIZE } from './game.ts';

export type CellStateProps = {
  x: number;
  y: number;
  enabled: boolean;
  markedByPlayer: Player | null;
  hover: boolean;
};

export type Cell = ReturnType<typeof cell>;
export const cell = (p: p5, magicNumber: number) => {
  const state: CellStateProps = {
    x: 0,
    y: 0,
    enabled: true,
    markedByPlayer: null,
    hover: false
  };

  const draw = () => {
    p.push();
    if (state.hover) {
      p.strokeWeight(5);
    }
    p.square(state.x, state.y, CELL_SIZE);
    p.pop();

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

  const setMarkedByPlayer = (player: Player) => {
    if (!state.enabled) {
      return;
    }

    state.markedByPlayer = player;
  };

  const setHover = (hover: boolean) => {
    if (!state.enabled) {
      return;
    }

    state.hover = hover;
  };

  const setEnabled = (enabled: boolean) => {
    state.enabled = enabled;
  };

  return {
    magicNumber,
    setMarkedByPlayer,
    setEnabled,
    setHover,
    get position() {
      return { x: state.x, y: state.y };
    },
    get isHover() {
      return state.hover;
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

const drawO = (p: p5, x: number, y: number) => {
  p.push();
  p.translate(x, y);

  p.stroke('blue');

  const centerOrigin = CELL_SIZE / 2;
  const diameter = CELL_SIZE / 2;

  p.circle(centerOrigin, centerOrigin, diameter);
  p.pop();
};
