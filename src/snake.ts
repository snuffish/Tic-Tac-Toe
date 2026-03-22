import p5 from 'p5';

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

const GRID_SIZE = 10;

const sketch = (p: p5Instance) => {
  let snake: ReturnType<typeof Snake>;
  let food: ReturnType<typeof spawnFood>;

  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.background(240);

    snake = Snake();
    food = spawnFood();
  };

  type SnakeBody = ReturnType<typeof SnakeBody>;
  const SnakeBody = (x: number, y: number) => {
    const position = p.createVector(x, y);

    const display = () => {
      p.point(position.x, position.y);
    };

    return {
      position,
      display
    };
  };

  const spawnFood = () => {
    // const x = p.floor(p.random(0, CANVAS_WIDTH / GRID_SIZE)) * GRID_SIZE;
    // const y = p.floor(p.random(0, CANVAS_HEIGHT / GRID_SIZE)) * GRID_SIZE;
    const x = 10
    const y = 30;

    return SnakeBody(x, y);
  };

  const Snake = () => {
    const direction = p.createVector(1, 0);
    const speed = 1;

    const body: SnakeBody[] = [
      SnakeBody(10, 10),
      SnakeBody(9, 10),
      SnakeBody(8, 10),
      SnakeBody(7, 10),
      SnakeBody(6, 10),
      SnakeBody(5, 10),
      SnakeBody(4, 10),
      SnakeBody(3, 10),
      SnakeBody(2, 10),
      SnakeBody(1, 10)
    ];

    const movement = () => {
      if (p.keyIsPressed) {
        if (p.keyCode === 40) {
          direction.set([0, 1]);
        } else if (p.keyCode === 39) {
          direction.set([1, 0]);
        } else if (p.keyCode === 37) {
          direction.set([-1, 0]);
        } else if (p.keyCode === 38) {
          direction.set([0, -1]);
        }
      }
    };

    const update = () => {
      for (let i = body.length - 1; i > 0; i--) {
        body[i].position.set(body[i - 1].position);
      }

      const velocity = direction.copy().mult(speed);
      body[0].position.add(velocity);

      hitFood();
      movement();
    };

    const hitFood = () => {
      const head = body[0];
      if (head.position.equals(food.position)) {
        addBody();
        food = spawnFood();
      }
    };

    const addBody = () => {
      const lastBody = body[body.length - 1];
      body.push(SnakeBody(lastBody.position.x, lastBody.position.y));
    };

    const display = () => {
      body.forEach((b) => b.display());
    };

    return {
      update,
      display
    };
  };

  p.draw = () => {
    p.push();
    p.scale(6);
    p.background(240);

    snake.update();
    snake.display();

    food.display();
    p.pop();
  };
};

export function mountSnake(container?: HTMLElement) {
  // @ts-ignore
  return new p5(sketch, container);
}
