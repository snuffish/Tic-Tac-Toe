import p5 from 'p5';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './env.ts';

const sketch = (p: p5) => {
  const container = p.createDiv();

  const createSquare = (x: number, y: number, size: number) => {
    const square = p.createDiv();
    square.position(x, y);
    square.attribute('row', String(0))
    square.attribute('col', String(1));

    return square
  };

  const square = createSquare(0, 0, 50)
  container.child(square)

  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.background(240);
  };

  p.draw = () => {};
};

export function mountSketch(container?: HTMLElement) {
  return new p5(sketch, container);
}
