import p5 from 'p5';
import type { ParticleSystem } from './particle-system.ts';

type ParticleArgs = {
  particleSystem: ParticleSystem;
  r?: number;
  x?: number;
  y?: number;
};

export abstract class Particle {
  protected p;
  private particleSystem;

  protected position!: p5.Vector;
  protected velocity!: p5.Vector;
  private acceleration!: p5.Vector;

  protected angle = 0;

  protected constructor({ x = 0, y = 0, r = 16, ...args }: ParticleArgs) {
    this.p = args.particleSystem.p;
    this.particleSystem = args.particleSystem;
    this.position = this.p.createVector(x, y);
    this.velocity = this.p.createVector(0, 0);
    this.acceleration = this.p.createVector(0, 0);

    this.onInit();
  }

  abstract onInit(): void;

  abstract onUpdate(): void;

  abstract display(): void;

  // public checkHit(other: Particle) {
  //   if (this === other) {
  //     return;
  //   }
  //
  //   const d = this.position.dist(other.position);
  //   this.isHit = d < this.r + other.r;
  //   other.isHit = this.isHit;
  // }

  public applyForce(force: p5.Vector) {
    this.acceleration.add(force);
  }

  public isDead() {
    return (
      this.position.y > this.p.height ||
      this.position.y < 0 ||
      this.position.x > this.p.width ||
      this.position.x < 0
    );
  }

  public update() {
    this.onUpdate();

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);

    this.acceleration.mult(0);
  }
}
