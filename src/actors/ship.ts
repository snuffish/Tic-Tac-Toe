import p5 from 'p5';
import type { BulletParticleSystem } from '../particles/bullet.ts';
import type { Actor } from './actor.ts';

type ShipArgs = {
  p: p5;
  bulletParticleSystem: BulletParticleSystem;
};

export class Ship implements Actor {
  p: p5;
  position!: p5.Vector;
  size = 50;

  leftGun;
  rightGun;

  constructor(args: ShipArgs) {
    this.p = args.p;
    this.leftGun = args.bulletParticleSystem.createEmitter('leftGun');
    this.rightGun = args.bulletParticleSystem.createEmitter('rightGun');
  }

  update() {
    const mouseVec = this.p.createVector(
      this.p.mouseX - this.size / 2,
      this.p.mouseY - this.size / 2
    );

    this.position = mouseVec;
    this.leftGun.emitter.position = mouseVec.copy();
    this.rightGun.emitter.position = mouseVec.copy().add([this.size, 0]);

    if (this.p.mouseIsPressed) {
      this.leftGun.emit();
      this.rightGun.emit();
    }
  }

  display() {
    this.p.push();
    this.p.translate(this.position);
    this.p.fill(255, 0, 0);
    this.p.rect(0, 0, this.size);
    this.p.pop();
  }
}
