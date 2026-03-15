import p5 from 'p5';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './env.ts';

const sketch = (p: p5) => {
  let wrapper: p5.Element;

  const createSquare = (x: number, y: number, size: number) => {
    const square = p.createDiv();
    square.parent(wrapper);
    square.style('position', 'absolute');
    square.position(x, y);

    square.style('width', `${size}px`);
    square.style('height', `${size}px`);
    square.style('border', '1px solid black');
    square.style('box-sizing', 'border-box');

    square.mouseOver(() => {
      square.style('background-color', 'yellow');

      square.html(`${x}x${y}`);
    })

    square.mouseOut(() => {
      square.style('background-color', 'transparent');

      square.html('');
    });


    return square;
  };

  p.setup = () => {
    wrapper = p.createDiv();
    wrapper.style('position', 'relative');
    wrapper.style('width', `${CANVAS_WIDTH}px`);
    wrapper.style('height', `${CANVAS_HEIGHT}px`);

    const canvas = p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent(wrapper);

    createSquare(50, 50, 50);
    createSquare(100 , 50, 50);

    p.background(240);
  };

  p.draw = () => {
    p.background(240);
  };
};

export function mountSketch(container?: HTMLElement) {
  return new p5(sketch, container);
}
