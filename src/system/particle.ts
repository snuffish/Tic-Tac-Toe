import p5 from 'p5';
import type { ParticleSystem } from './particle-system.ts';

const gravity = new p5.Vector(0, 0.1);

export class Particle {
  private p;
  private particleSystem;

  private position!: p5.Vector;
  public r;

  public velocity!: p5.Vector;
  public acceleration!: p5.Vector;

  private angle = 0;

  private isHit = false;
  private lifeSpan = 255;

  public color!: p5.Vector;

  constructor(particleSystem: ParticleSystem, r: number = 16) {
    this.p = particleSystem.p;
    this.particleSystem = particleSystem;
    this.r = r;

    this.onInit();
  }

  scale

  onInit() {
    this.position = this.particleSystem.origin.copy();
    this.velocity = this.p.createVector(0, 0);
    this.acceleration = this.p.createVector(0, 0);
    this.lifeSpan = 350;

    this.color = this.p.createVector(
      this.p.random(-1, 255),
      this.p.random(-1, 255),
      this.p.random(-1, 255)
    );

    this.applyForce(
      this.p.createVector(this.p.random(-1, 1), this.p.random(-2, 0))
    );

    this.scale = this.p.random(0.5, 3);
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

  protected isDead() {
    return this.lifeSpan <= 0;
  }

  public update() {
    this.acceleration.add(gravity);
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    this.lifeSpan -= 2.5;
    this.angle += 2;

    this.acceleration.mult(0);

    if (this.isDead()) {
      this.onInit()
    }
  }

  public display() {
    this.p.push();

    this.p.translate(this.position);
    this.p.rotate(this.angle);
    this.p.stroke(0, this.lifeSpan);
    this.p.fill(this.color.x, this.color.y, this.color.z, this.lifeSpan);
    this.p.scale(this.lifeSpan / 255);
    this.p.circle(0, 0, this.r);

    this.p.pop();
  }
}
