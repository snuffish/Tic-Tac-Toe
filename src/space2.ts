import p5 from 'p5';
import { ParticleSystem } from './system/particle-system.ts';

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

const sketch = (p: p5Instance) => {
  const particleSystems: ParticleSystem[] = [];

  p.setup = () => {
    window.p = p;

    p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    p.angleMode(p.DEGREES);

    particleSystems.push(new ParticleSystem(p, 300, 100));
  };

  p.draw = () => {
    p.background(0);

    if (p.mouseIsPressed) {
      particleSystems[0].position.set(p.mouseX, p.mouseY);
    }

    particleSystems.forEach((particleSystem) => {
      particleSystem.run()
    });
  };
};

export function mountSpace(container?: HTMLElement) {
  return new p5(sketch, container);
}
