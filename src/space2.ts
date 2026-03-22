import p5 from 'p5';
import { ParticleSystem } from './particles/particle-system.ts';
import { BulletParticleSystem } from './particles/bullet.ts';
import { Ship } from './actors/ship.ts';
import type { Actor } from './actors/actor.ts';
import { Alien } from './actors/alien.ts';

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

const sketch = (p: p5Instance) => {
  const particleSystems: ParticleSystem[] = [];
  const actors: Actor[] = [];

  p.setup = () => {
    p.particleSystems = particleSystems;
    window.p = p;

    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.angleMode(p.DEGREES);

    const bulletParticleSystem = new BulletParticleSystem(p, p.width / 2, 634);
    particleSystems.push(bulletParticleSystem);

    const ship = new Ship({
      p,
      bulletParticleSystem
    });
    actors.push(ship);

    const alien = new Alien({
      p
    });
    actors.push(alien);
  };

  p.draw = () => {
    p.background(0);

    actors.forEach((actor) => {
      actor.update();
      actor.display();
    });

    particleSystems.forEach((particleSystem) => {
      particleSystem.run();
    });
  };
};

export function mountSpace(container?: HTMLElement) {
  return new p5(sketch, container);
}
