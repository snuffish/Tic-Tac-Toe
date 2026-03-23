import { Particle } from './particle.ts';
import { ParticleSystem } from './particle-system.ts';
import p5 from 'p5';
import type { Emitter } from './emitter.ts';

export class Bullet extends Particle {
  constructor(system: BulletParticleSystem, x: number = 0, y: number = 0) {
    super({
      particleSystem: system,
      x,
      y
    });
  }

  onInit(): void {
    const angleDeg = this.p.random(-95, -85);
    const angleRad = this.p.radians(angleDeg);

    const speed = 18;
    const velocity = p5.Vector.fromAngle(angleRad).mult(speed);

    this.applyForce(velocity);
  }

  onUpdate(): void {
    this.applyForce(this.p.createVector(0, 0.15));
    this.velocity.mult(0.999);
  }

  display(): void {
    this.p.push();
    this.p.translate(this.position);
    this.p.stroke(255);
    this.p.rect(0, 0, 1, 16);
    this.p.pop();
  }
}

export class BulletParticleSystem extends ParticleSystem {
  constructor(p: p5, x: number, y: number) {
    super(p, x, y);
  }

  protected onDisplay(emitter: Emitter) {
    this.p.translate(emitter.position);
    this.p.noFill();
    this.p.stroke('yellow');
    this.p.circle(0, 0, 16);
  }

  protected createParticle(emitter: Emitter): Particle {
    return new Bullet(this, emitter.position.x, emitter.position.y);
  }
}
