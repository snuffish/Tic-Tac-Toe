import p5 from 'p5';

const gravity = new p5.Vector(0, 0.1);

export class Particle {
  private p;
  private position;
  public r;

  public velocity;
  public acceleration;

  private angle = 0;

  private isHit = false;
  private lifeSpan = 255;

  public color: p5.Vector;

  constructor(p: p5, x: number, y: number, r: number = 16) {
    this.p = p;
    this.velocity = p.createVector(0, 0);
    this.acceleration = p.createVector(0, 0);
    this.position = p.createVector(x, y);
    this.r = r;

    this.color = this.p.createVector(
      this.p.random(-1, 255),
      this.p.random(-1, 255),
      this.p.random(-1, 255)
    );
  }

  public checkHit(other: Particle) {
    if (this === other) {
      return;
    }

    const d = this.position.dist(other.position);
    this.isHit = d < this.r + other.r;
    other.isHit = this.isHit;
  }

  public applyForce(force: p5.Vector) {
    this.acceleration.add(force);
  }

  public isDead() {
    return this.lifeSpan <= 0;
  }

  public update() {
    this.acceleration.add(gravity);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    this.lifeSpan -= 2.5;
    this.angle += 2;

    this.acceleration.mult(0);
  }

  public display() {
    this.p.push();

    this.p.translate(this.position);
    this.p.rotate(this.angle);
    this.p.stroke(0, this.lifeSpan);
    this.p.fill(this.color.x, this.color.y, this.color.z, this.lifeSpan);
    this.p.circle(0, 0, this.r);

    this.p.pop();
  }
}
