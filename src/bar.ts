import p5 from 'p5';
import { CANVAS_HEIGHT } from './space2.ts';

const gravity = new p5.Vector(0, 0.5);

export class Bar {
  static height = 10;

  p;
  position;
  radius;

  direction;
  vel;
  acc;

  rotate;

  strokeColor;

  clearLinePos;

  constructor(p: p5, x: number, y: number) {
    this.p = p;
    this.position = p.createVector(x, y);
    this.radius = 32;

    this.direction = p.createVector(0, -1);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);

    this.rotate = p.random(0, 1) > 0.5;

    this.strokeColor = p5.Vector.random3D()
      .normalize()
      .setMag(this.p.random(0, 255));

    this.clearLinePos = p.createVector(x, 0);

    this.dir = this.p.random(0, 1) > 0.5 ? 1 : -1;
  }

  update() {
    this.vel.add(gravity);
    this.vel.add(this.acc);
    this.position.add(this.vel);

    this.vel.mult(0.9);

    this.acc.mult(0);

    if (this.position.y > CANVAS_HEIGHT) {
      this.position.y = CANVAS_HEIGHT;
      const f = this.direction.copy().setMag(this.p.random(50, 90));
      // this.strokeColor = this.p.createVector(
      //   this.p.random(0, 255),
      //   this.p.random(0, 255),
      //   this.p.random(0, 255)
      // );
      this.acc.add(f);
      window.bg = true;
      // this.vel.y *= -1;
    }

    if (this.position.y > this.clearLinePos.y) {
      this.clearLinePos.y = this.position.y;
    }

    this.clearLinePos.add(gravity);

    // if (this.position.y > 300) {
    //   this.acc.add(this.direction.setMag(20))
    // }

    if (this.p.keyIsDown(' ')) {
      this.acc.add(this.direction);
    }

    // this.angle += this.dir;

    this.strokeColor.x *= 2
  }

  angle = 0;
  dir = 1

  display() {
    const d = this.radius * 2;

    this.p.push();
    this.p.translate(this.position);
    if (this.rotate) {
      this.p.rotate(this.angle);
    }
    this.p.fill(this.strokeColor.x, this.strokeColor.y % 25, this.strokeColor.z);
    this.p.rect(0, 0, d, Bar.height);

    this.p.pop();

    // this.p.push();
    // this.p.translate(this.position);
    // this.p.strokeWeight(3)
    // this.p.pop();
  }
}
