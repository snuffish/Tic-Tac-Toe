import { Particle } from './particle.ts';
import p5 from 'p5';

export class ParticleSystem {
  public p;
  public position;
  protected maxParticles;
  protected emitting = false;
  protected size = 50;

  private particles: Particle[] = [];

  constructor(p: p5, x: number, y: number, maxParticles = 100) {
    this.p = p;
    this.position = p.createVector(x, y);
    this.maxParticles = maxParticles;
  }

  get origin() {
    const origin = this.position.copy();
    origin.sub([this.size / 2]);
    return origin;
  }

  protected emit() {
    if (!this.emitting || this.particles.length >= this.maxParticles) {
      return;
    }

    const par = new Particle(this);
    this.particles.push(par);
  }

  protected update() {
    this.emit();

    this.particles.forEach((par) => par.update())
  }

  public run() {
    this.emitting = true;
    this.update();
    this.display();
  }

  public stop() {
    this.emitting = false;
  }

  protected display() {
    this.p.push();
    this.p.translate(this.origin);
    this.p.fill(255, 0, 0);
    this.p.rect(0, 0, this.size, this.size);
    this.p.pop();

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const par = this.particles[i];

      par.display();
    }
  }
}
