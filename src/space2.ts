import p5 from 'p5';
import { ParticleSystem } from './particles/particle-system.ts';
import { BulletParticleSystem } from './particles/bullet.ts';
import { Ship } from './actors/ship.ts';
import type { Actor } from './actors/actor.ts';
import { Alien } from './actors/alien.ts';
import { ComponentsManager } from './managers/components.ts';
import { HudManager } from './managers/hud.ts';

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

const sketch = (p: p5Instance) => {
  const componentsManager = new ComponentsManager(p);

  p.setup = () => {
    window.p = p;

    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.angleMode(p.DEGREES);

    const bulletParticleSystem = new BulletParticleSystem(p, p.width / 2, 634);
    componentsManager.register(bulletParticleSystem);

    const ship = new Ship({
      bulletParticleSystem
    });
    componentsManager.register(ship);

    componentsManager
      .register(
        new Alien({
          p
        })
      )
      .register(
        new Alien({
          p,
          x: 150,
          y: 200
        })
      );

    componentsManager.register(new HudManager());
  };

  p.draw = () => {
    p.background(0);

    componentsManager.run();
  };
};

export function mountSpace(container?: HTMLElement) {
  return new p5(sketch, container);
}
