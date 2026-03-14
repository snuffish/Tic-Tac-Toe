import p5 from 'p5';
import { changePlayer, Player } from '../helper.ts';
import { BOX_SIZE } from '../env.ts';

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

  let mousePressed = false;

  let takenByPlayer: keyof typeof Player | null = null;

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

  document.addEventListener('onMousePressed', () => {
    mousePressed = true;
  });

  document.addEventListener('onMouseReleased', () => {
    mousePressed = false;
  });

  document.addEventListener('onBoxPressed', (e) => {
    const { player, boxNr } = e.detail;

    if (boxNr === nr) {
      takenByPlayer = player;
    }
  });

  document.addEventListener('onBoxReset', (e) => {
    const { boxNr } = e.detail;

    if (boxNr === nr) {
      resetBox();
    }
  });

  document.addEventListener('onGameReset', () => {
    resetBox();
  });

  const onUpdate = () => {
    mouseOver = isMouseOver();

    if (mouseOver && mousePressed && !marked) {
      marked = true;
      onClicked?.();

      document.dispatchEvent(
        new CustomEvent('onBoxPressed', {
          detail: {
            boxNr: nr,
            player: window.currentPlayer
          }
        })
      );

      changePlayer();
    }
  };

  const onDraw = () => {
    p.push();

    if (mouseOver) {
      p.stroke(Player[window.currentPlayer].color);
      p.strokeWeight(3);
    }

    p.square(x, y, diameter);
    p.pop();

    if (takenByPlayer !== null) {
      p.push();

      if (window.gameWinner) {
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
