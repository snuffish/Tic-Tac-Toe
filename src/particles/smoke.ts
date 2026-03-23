import { ParticleSystem } from './particle-system.ts';
import p5 from 'p5';
import { Particle } from './particle.ts';

export class Smoke extends Particle {
  constructor(system: SmokeParticleSystem) {
    super(system);
  }

  onInit() {
    this.applyForce(
      this.p.createVector(this.p.random(-1, 1), this.p.random(-2, 0))
    );
  }

  onUpdate() {
    this.applyForce(this.p.createVector(0, -0.2));
  }

  display() {
    this.p.translate(this.position);
    this.p.rotate(this.angle);
    this.p.stroke(0, this.lifeSpan);
    this.p.fill(255, this.lifeSpan);
    this.p.scale(this.lifeSpan / 255);
    // this.p.circle(0, 0, this.r);
  }
}

export class SmokeParticleSystem extends ParticleSystem {
  constructor(p: p5, x: number, y: number) {
    super(p, x, y);
  }

  protected createParticle() {
    return new Smoke(this);
  }
}
