import p5 from 'p5';
import { Player, renderButton, renderText } from '../helper.ts';

export const GameHud = (p: p5): GameObject => {
  const onUpdate = () => {};

  const onPlayerTurn = () => {
    renderText(
      p,
      `Its ${Player[window.currentPlayer].name} turn!`,
      Player[window.currentPlayer].color
    );
  };

  const onGameWinner = () => {
    if (!window.gameWinner) return

    renderText(
      p,
      `The winner is ${window.gameWinner}`,
      Player[window.gameWinner].color
    );

    renderButton(p)
  };

  const onDraw = () => {
    if (window.gameWinner) {
      onGameWinner();
    } else {
      onPlayerTurn();
    }
  };

  return {
    onDraw,
    onUpdate
  };
};
