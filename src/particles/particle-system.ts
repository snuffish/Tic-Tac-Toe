import p5 from 'p5';
import type { Particle } from './particle.ts';
import { Emitter } from './emitter.ts';

export abstract class ParticleSystem {
  public p;
  public position;
  protected maxParticles;

  public particles: Particle[] = [];
  private emitters: Emitter[] = [];

  protected constructor(
    p: p5,
    x: number = p.width / 2,
    y: number = p.height / 2,
    maxParticles = 100
  ) {
    this.p = p;
    this.position = p.createVector(x, y);
    this.maxParticles = maxParticles;
  }

  protected abstract createParticle(emitter: Emitter): Particle;

  protected onDisplay(emitter: Emitter): void {
    // Override in subclass
  }

  public createEmitter(name: string, x: number = 0, y: number = 0) {
    const emitter = new Emitter(name, x, y);
    this.emitters.push(emitter);

    return {
      emitter,
      emit: () => this.emit(emitter)
    };
  }

  public getEmitter(name: string) {
    const emitter = this.emitters.find((e) => e.name === name);
    if (!emitter) {
      throw new Error(`Emitter ${name} not found`);
    }

    return {
      emitter,
      emit: () => this.emit(emitter)
    };
  }

  private emit(emitter: Emitter = this.emitters[0]) {
    if (this.particles.length >= this.maxParticles) {
      return;
    }

    const par = this.createParticle(emitter);
    this.particles.push(par);
  }

  protected update() {
    this.particles = this.particles.filter((par) => !par.isDead());

    this.particles.forEach((par) => {
      par.update();
    });
  }

  public run() {
    this.update();

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const par = this.particles[i];
      par.display();
    }

    this.emitters.forEach((emitter) => {
      this.p.push()
      this.onDisplay(emitter);
      this.p.pop();
    });
  }
}
