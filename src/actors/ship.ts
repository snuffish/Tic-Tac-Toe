import p5 from 'p5';
import type { BulletParticleSystem } from '../particles/bullet.ts';
import type { IComponent } from '../types/types';

type ShipArgs = {
  bulletParticleSystem: BulletParticleSystem;
};

export class Ship implements IComponent {
  position!: p5.Vector;
  size = 50;

  leftGun;
  rightGun;

  constructor({ bulletParticleSystem }: ShipArgs) {
    this.leftGun = bulletParticleSystem.createEmitter('leftGun');
    this.rightGun = bulletParticleSystem.createEmitter('rightGun');
  }

  onUpdate(p: p5) {
    const mouseVec = p.createVector(
      p.mouseX - this.size / 2,
      p.mouseY - this.size / 2
    );

    this.position = mouseVec;
    this.leftGun.emitter.position = mouseVec.copy();
    this.rightGun.emitter.position = mouseVec.copy().add([this.size, 0]);

    if (p.mouseIsPressed) {
      this.leftGun.emit();
      this.rightGun.emit();
    }
  }

  onDisplay(p: p5) {
    p.translate(this.position);
    p.fill(255, 0, 0);
    p.rect(0, 0, this.size);
  }
}
