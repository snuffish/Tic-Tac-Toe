import { CANVAS_HEIGHT, CANVAS_WIDTH } from './env.ts';
import p5 from 'p5';

export const changePlayer = () => {
  window.currentPlayer =
    window.currentPlayer === 'player1' ? 'player2' : 'player1';
};

export const COLOR: Record<Color, RGB> = {
  NONE: [0, 0, 0],
  RED: [255, 0, 0],
  GREEN: [0, 255, 0],
  BLUE: [0, 0, 255]
};

const createPlayer = (name: string, symbol: string, color: RGB) => ({
  name,
  symbol,
  color
});

export const Player = {
  player1: createPlayer('Player 1', 'X', COLOR.GREEN),
  player2: createPlayer('Player 2', 'O', COLOR.RED)
};

export const renderText = (p: p5, text: string, color: RGB) => {
  p.push();
  p.textAlign('center');

  p.fill(color);

  const bounds = p.textBounds(text, 0, CANVAS_HEIGHT * 0.85, CANVAS_WIDTH);
  p.textSize(20);
  p.text(text, 0, bounds.y, CANVAS_WIDTH);
  p.pop();
};

export const renderButton = (p: p5) => {
  const button = p.createButton('New Game')
  button.position(CANVAS_WIDTH / 2, CANVAS_HEIGHT * 0.9)
  button.mousePressed(() => {
    window.game?.resetGame()
  })
}
