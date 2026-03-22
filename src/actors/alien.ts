import type { Actor } from './actor.ts';
import p5 from 'p5';

type AlienArgs = {
  p: p5
}

export class Alien implements Actor {
  p: p5
  position: p5.Vector

  constructor(args: AlienArgs) {
    this.p = args.p
    this.position = this.p.createVector(this.p.width / 2, 100)
  }

  update() {

  }

  display() {
    this.p.push()
    this.p.translate(this.position)
    this.p.fill('blue')
    this.p.circle(0, 0, 100)
    this.p.pop();
  }
}
