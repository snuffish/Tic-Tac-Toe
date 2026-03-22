import { Particle } from './particle.ts';
import p5 from 'p5';

export class ParticleSystem {
  protected p;
  public position;
  protected maxParticles;
  protected emitting = false;
  protected size = 50;

  private particles: Particle[] = [];

  colorPicker;

  constructor(p: p5, x: number, y: number, maxParticles = 100) {
    this.p = p;
    this.position = p.createVector(x, y);
    this.maxParticles = maxParticles;

    this.colorPicker = p.createColorPicker('#000');
  }

  get origin() {
    const origin = this.position.copy();
    origin.sub([this.size / 2]);
    return origin;
  }

  protected emit() {
    if (!this.emitting && this.particles.length >= this.maxParticles) {
      return;
    }

    const par = new Particle(this.p, this.origin.x, this.origin.y);
    par.applyForce(
      this.p.createVector(this.p.random(-1, 1), this.p.random(-2, 0))
    );
    this.particles.push(par);
  }

  protected removeDeadParticles() {
    this.particles = this.particles.filter((par) => !par.isDead());
  }

  protected update() {
    this.removeDeadParticles();
    this.emit();
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

      par.color = this.p.color(this.colorPicker.value().toString());

      par.update();
      par.display();
    }
  }
}
