import p5 from 'p5';

export const createSketch = (p: p5) => {
  let clickCount = 0;

  p.mousePressed = () => {
    clickCount++;
  };
};
