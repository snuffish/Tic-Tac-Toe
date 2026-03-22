import p5 from 'p5';
import type { GameStateProps } from './types';
import type { ParticleSystem } from '../particles/particle-system.ts';

declare module '*.css';

declare global {
  type p5Instance = p5 & {
    gameState?: GameStateProps;
    particleSystems?: ParticleSystem[];
  };

  interface Window {
    p: p5Instance;
    bg: boolean;
  }

  type RGB = [number, number, number];
  type Color = 'NONE' | 'RED' | 'GREEN' | 'BLUE';

  type Player = 'player1' | 'player2';
}

declare module 'p5' {
  namespace p5 {
    interface Vector {
      myFunc: () => void;
    }
  }
}

export {};
