declare module '*.css';

declare global {
  type RGB = [number, number, number];
  type Color = 'NONE' | 'RED' | 'GREEN' | 'BLUE';

  type Player = 'player1' | 'player2';
}

export {};
