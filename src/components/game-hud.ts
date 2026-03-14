import p5 from 'p5';
import { Player, renderButton, renderText } from '../helper.ts';
import { useGameStore } from '../store.ts';

export const GameHud = (p: p5): GameObject => {
  const onUpdate = () => {};

  const onPlayerTurn = () => {
    const { currentPlayer } = useGameStore.getState();
    renderText(
      p,
      `Its ${Player[currentPlayer].name} turn!`,
      Player[currentPlayer].color
    );
  };

  const onGameWinner = () => {
    const { gameWinner } = useGameStore.getState();
    if (!gameWinner) return

    renderText(
      p,
      `The winner is ${gameWinner}`,
      Player[gameWinner].color
    );

    renderButton(p)
  };

  const onDraw = () => {
    if (useGameStore.getState().gameWinner) {
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
