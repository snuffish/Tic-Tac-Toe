import p5 from 'p5';
import { ParticleSystem } from './particles/particle-system.ts';
import { BulletParticleSystem } from './particles/bullet.ts';
import { Ship } from './actors/ship.ts';

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

const sketch = (p: p5Instance) => {
  const particleSystems: ParticleSystem[] = [];

  p.setup = () => {
    p.particleSystems = particleSystems;
    window.p = p;

    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.angleMode(p.DEGREES);

    // particleSystems.push(new SmokeParticleSystem(p, p.width / 2, 634));

    const bulletParticleSystem = new BulletParticleSystem(p, p.width / 2, 634)
    particleSystems.push(bulletParticleSystem);

    ship = new Ship({
      p,
      bulletParticleSystem
    });
  };

  let ship: Ship;

  p.draw = () => {
    p.background(0);

    ship.update();
    ship.display();

    particleSystems.forEach((particleSystem) => {
      particleSystem.run();
    });
  };
};

export function mountSpace(container?: HTMLElement) {
  return new p5(sketch, container);
}
