import type { IComponent } from '../types/types';
import type p5 from 'p5';

export class HudManager implements IComponent {
  private fps: number = 0;

  update(p: p5) {
    if (p.frameCount % 10 === 0) {
      this.fps = p.floor(p.frameRate());
    }
  }

  display(p: p5) {
    p.translate(0, p.height - 50);
    p.fill('red');
    p.textSize(20);
    p.textAlign('right');
    p.text(`FPS: ${this.fps}`, 0, 0, p.width - 100, 50);
  }
}
