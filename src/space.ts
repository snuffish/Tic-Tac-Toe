import p5 from 'p5';

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;

const sketch = (p: p5) => {
  let ball: ReturnType<typeof Ball>;
  let string: ReturnType<typeof String>;

  const String = () => {
    const position = p.createVector(CANVAS_WIDTH / 2, 0);

    const display = () => {
      p.push();
      p.stroke(0);
      p.strokeWeight(2);
      p.line(position.x, position.y, ball.position.x, ball.position.y);
      p.pop();
    };

    return { display, position };
  };

  const Ball = () => {
    const diameter = 50;
    const position = p.createVector(CANVAS_WIDTH / 2, 50);
    const gravity = p.createVector(0, 0.4);
    const velocity = p.createVector(0, 0);
    const jumpStrength = -20;

        const anchor = p.createVector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        const restLength = 150;
        const springK = 0.05;
        const damping = 0.98;

        const enforceStringLength = () => {
          p.push()
          p.translate(100, 100)

          const vec1 = p.createVector(0, 0)
          const vec2 = p.createVector(100, -100);
          const s = p5.Vector.sub(vec1, vec2).limit(10).mag();
          p.strokeWeight(3)
          p.line(vec1.x, vec1.y, vec2.x, vec2.y);
          p.pop()

          const delta = p5.Vector.sub(position, anchor);
          const distance = delta.mag();

          if (distance === 0) return;

          const stretch = distance - restLength;
          const force = delta.copy().normalize().mult(-springK * stretch);

          velocity.add(force);
          velocity.mult(damping);
        };

        const update = () = {
          enforceStringLength();
          position.add(velocity);

          if (p.mouseIsPressed) {
            velocity.y = jumpStrength;
          }
        };

    const display = () => {
      p.push();
      p.ellipse(position.x, position.y, diameter);
      p.pop();
    };

    return { display, update, position };
  };

  p.setup = () => {
    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.background(240);

    ball = Ball();
    string = String();
  };

  p.draw = () => {
    p.push();
    p.background(240);

    string.display();

    ball.update();
    ball.display();
  };
};

export function mountSpace(container?: HTMLElement) {
  return new p5(sketch, container);
}
