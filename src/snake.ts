import p5 from 'p5';

const sketch = (p: p5Instance) => {
  p.setup = () => {
    p.createCanvas(400, 400);
    p.background(240);
  }

  const Snake = () => {
    const position = p.createVector(50,50);

    const update = () => {
      position.add([1, 0])
    }

    const display = () => {
      p.point(position.x, position.y)
    }

    return {
      update,
      display
    }
  }

  const snake = Snake();

  p.draw = () => {
    snake.update();
    snake.display();
  }
}

export function mountSnake(container?: HTMLElement) {
  // @ts-ignore
  return new p5(sketch, container);
}
