import { ParticleSystem } from '../particles/particle-system.ts';
import type { IComponent } from '../types/types';
import type p5 from 'p5';

export class ComponentsManager {
  private p: p5;

  private particleSystems: ParticleSystem[] = [];
  private components: IComponent[] = [];

  constructor(p: p5) {
    this.p = p;
  }

  public register(component: ParticleSystem | IComponent) {
    if (component instanceof ParticleSystem) {
      this.particleSystems.push(component);
    } else {
      this.components.push(component);
    }

    return this;
  }

  public run() {
    this.components.forEach((component) => {
      component.update(this.p);

      this.p.push();
      component.display(this.p);
      this.p.pop();
    });

    this.particleSystems.forEach((particleSystem) => {
      particleSystem.run();
    });
  }
}
