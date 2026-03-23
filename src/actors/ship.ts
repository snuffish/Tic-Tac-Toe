import p5 from 'p5';
import type { BulletParticleSystem } from '../particles/bullet.ts';
import { Actor } from './actor.ts';

type ShipArgs = {
  bulletParticleSystem: BulletParticleSystem;
};

export class Ship extends Actor {
  position!: p5.Vector;
  size = 50;

  leftGun;
  rightGun;

  constructor({ bulletParticleSystem }: ShipArgs) {
    super();
    this.leftGun = bulletParticleSystem.createEmitter('leftGun');
    this.rightGun = bulletParticleSystem.createEmitter('rightGun');
  }

  update(p: p5) {
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

  display(p: p5) {
    p.translate(this.position);
    p.fill(255, 0, 0);
    p.rect(0, 0, this.size);
  }
}
