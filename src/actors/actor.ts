import type { IComponent } from '../types/types';
import type p5 from 'p5';

export abstract class Actor implements IComponent {
  abstract update(p: p5): void;
  abstract display(p: p5): void;
}
