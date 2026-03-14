import p5 from 'p5';
import { changePlayer, Player } from '../helper.ts';
import type { PlayerKey } from '../helper.ts';
import { BOX_SIZE } from '../env.ts';
import { useGameStore } from '../store.ts';

export type BoxProps = {
  nr: number;
  x: number;
  y: number;
  diameter?: number;
  onClicked?: () => void;
};

export const Box = (
  p: p5,
  { nr, x, y, diameter = BOX_SIZE, onClicked }: BoxProps
): GameObject & Pick<BoxProps, 'nr'> => {
  let marked = false;
  let mouseOver = false;

  let takenByPlayer: PlayerKey | null = null;

  const isMouseOver = () => {
    const { mouseX, mouseY } = p;

    return (
      mouseX >= x &&
      mouseX <= x + diameter &&
      mouseY >= y &&
      mouseY <= y + diameter
    );
  };

  const resetBox = () => {
    marked = false;
    takenByPlayer = null;
  };

  useGameStore.subscribe((state, prevState) => {
    // onBoxPressed
    if (state.lastBoxPressed !== prevState.lastBoxPressed && state.lastBoxPressed?.boxNr === nr) {
      takenByPlayer = state.lastBoxPressed.player;
    }
    // onBoxReset
    if (state.lastBoxReset !== prevState.lastBoxReset && state.lastBoxReset?.boxNr === nr) {
      resetBox();
    }
    // onGameReset
    if (state.lastGameReset !== prevState.lastGameReset) {
      resetBox();
    }
  });

  const onUpdate = () => {
    mouseOver = isMouseOver();
    const { mousePressed, currentPlayer } = useGameStore.getState();

    if (mouseOver && mousePressed && !marked) {
      marked = true;
      onClicked?.();

      useGameStore.getState().actions.triggerBoxPressed(currentPlayer, nr);

      changePlayer();
    }
  };

  const onDraw = () => {
    const { currentPlayer, gameWinner } = useGameStore.getState();
    p.push();

    if (mouseOver) {
      p.stroke(Player[currentPlayer].color);
      p.strokeWeight(3);
    }

    p.square(x, y, diameter);
    p.pop();

    if (takenByPlayer !== null) {
      p.push();

      if (gameWinner) {
        p.fill(100, 100, 100);
      } else {
        p.fill(Player[takenByPlayer].color);
      }

      p.textFont('Arial', 20);
      p.textAlign('center', 'center');
      p.text(Player[takenByPlayer].symbol, x, y, diameter, diameter);
      p.pop();
    }

    p.stroke(0);
    p.strokeWeight(1);
  };

  return {
    get nr() {
      return nr;
    },
    onUpdate,
    onDraw
  };
};
