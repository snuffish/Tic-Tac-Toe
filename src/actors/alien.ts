import p5 from 'p5';
import type { IComponent } from '../types/types';

type AlienArgs = {
  p: p5;
  x?: number;
  y?: number;
};

export class Alien implements IComponent {
  p: p5;
  position: p5.Vector;
  direction = new p5.Vector(1, 0);
  speed = 2;

  constructor({ p, x = p.width / 2, y = 100 }: AlienArgs) {
    this.p = p;
    this.position = this.p.createVector(x, y);
  }

  private move() {
    this.position.add(this.direction.copy().mult(this.speed));
  }

  private stepDown() {
    this.position.y += 100;
  }

  private edges() {
    const rightEdge = this.position.dist(
      this.p.createVector(this.p.width, this.position.y)
    );
    const leftEdge = this.position.dist(
      this.p.createVector(0, this.position.y)
    );

    const hitEdge = this.position.x < 0 || rightEdge < 50 || leftEdge < 50;
    if (hitEdge) {
      this.direction.x *= -1;
      this.stepDown();
    }
  }

  onUpdate() {
    this.move();
    this.edges();
  }

  onDisplay(p: p5) {
    p.translate(this.position);
    p.fill('blue');
    p.circle(0, 0, 100);
  }
}
