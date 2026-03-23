import { Actor } from './actor.ts';
import p5 from 'p5';

type AlienArgs = {
  p: p5;
  x?: number;
  y?: number;
};

export class Alien extends Actor {
  p: p5;
  position: p5.Vector;
  direction = new p5.Vector(1, 0);
  speed = 2;

  constructor({ p, x = p.width / 2, y = 100 }: AlienArgs) {
    super();
    this.p = p;
    this.position = this.p.createVector(x, y);
  }

  private move() {
    this.position.add(this.direction.copy().mult(this.speed));
  }

  private edges() {
    const rightEdge = this.position.dist(
      this.p.createVector(this.p.width, this.position.y)
    );
    const leftEdge = this.position.dist(
      this.p.createVector(0, this.position.y)
    );

    if (this.position.x < 0 || rightEdge < 50 || leftEdge < 50) {
      this.direction.x *= -1;
    }
  }

  update() {
    this.move();
    this.edges();
  }

  display(p: p5) {
    p.push();
    p.translate(this.position);
    p.fill('blue');
    p.circle(0, 0, 100);
    p.pop();
  }
}
