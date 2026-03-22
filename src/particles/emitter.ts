import p5 from 'p5';

export class Emitter {
  name;
  position;

  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.position = new p5.Vector(x, y);
  }
}
