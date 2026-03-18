import { afterEach, beforeEach, expect, suite, test } from 'vitest';
import { checkGameStatus, mountSketch } from '../game.ts';
import p5 from 'p5';

suite('Tic-Tac-Toe Game', () => {
  let p5Instance: p5Instance;
  let dummyScript: HTMLScriptElement;

  beforeEach(() => {
    // Disable p5's friendly errors as it trips over jsdom's lack of script src
    p5.disableFriendlyErrors = true;

    // Create a dummy script tag with src because p5 FES searches for it
    dummyScript = document.createElement('script');
    dummyScript.src = 'dummy.js';
    document.head.appendChild(dummyScript);

    // We need a DOM element for p5
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Mount the sketch
    p5Instance = mountSketch(container) as p5Instance;

    // Check if instance was created
    expect(p5Instance).toBeDefined();
  });

  afterEach(() => {
    // Clean up
    p5Instance.remove();
    document.head.removeChild(dummyScript);
  });

  test('Instantiate sketch and interact with the board', () => {
    // @ts-ignore
    const gameState = p5Instance.gameState;

    // The initial turn is player1
    expect(gameState.currentPlayer).toBe('player1');

    // Simulate a mouse click over the top-left cell: (row 0, col 0)
    // In game.ts, position.x is 20, position.y is 40.
    // CELL_SIZE is 50. So top-left is x: 20-70, y: 40-90.
    p5Instance.mouseX = 30; // Just inside the top-left cell width
    p5Instance.mouseY = 50; // Just inside the top-left cell height

    p5Instance.mousePressed();

    // After clicking, the cell should be marked by player1 and it should be player2's turn
    expect(gameState.board.cells[0][0].markedByPlayer).toBe('player1');
    expect(gameState.currentPlayer).toBe('player2');

    // Simulate another click over the middle cell: (row 1, col 1)
    // middle cell x: 20 + 50 = 70 to 120. y: 40 + 50 = 90 to 140
    p5Instance.mouseX = 80;
    p5Instance.mouseY = 100;

    p5Instance.mousePressed();

    expect(gameState.board.cells[1][1].markedByPlayer).toBe('player2');
    expect(gameState.currentPlayer).toBe('player1');
  });

  suite('Winner checks', () => {
    test('Horizontal first row', () => {
      const gameState = p5Instance.gameState;
      gameState.board.cells[0][0].setMarkedByPlayer('player1');
      gameState.board.cells[0][1].setMarkedByPlayer('player1');
      gameState.board.cells[0][2].setMarkedByPlayer('player1');

      const status = checkGameStatus(gameState);
      expect(status?.player).toBe('player1');
    });

    test('Horizontal second row', () => {
      const gameState = p5Instance.gameState;
      gameState.board.cells[1][0].setMarkedByPlayer('player1');
      gameState.board.cells[1][1].setMarkedByPlayer('player1');
      gameState.board.cells[1][2].setMarkedByPlayer('player1');

      const status = checkGameStatus(gameState);
      expect(status?.player).toBe('player1');
    });

    test('Horizontal third row', () => {
      const gameState = p5Instance.gameState;
      gameState.board.cells[2][0].setMarkedByPlayer('player1');
      gameState.board.cells[2][1].setMarkedByPlayer('player1');
      gameState.board.cells[2][2].setMarkedByPlayer('player1');

      const status = checkGameStatus(gameState);
      expect(status?.player).toBe('player1');
    });

    test('Vertical first column', () => {
      const gameState = p5Instance.gameState;
      gameState.board.cells[0][0].setMarkedByPlayer('player1');
      gameState.board.cells[1][0].setMarkedByPlayer('player1');
      gameState.board.cells[2][0].setMarkedByPlayer('player1');

      const status = checkGameStatus(gameState);
      expect(status?.player).toBe('player1');
    });

    test('Vertical second column', () => {
      const gameState = p5Instance.gameState;
      gameState.board.cells[0][1].setMarkedByPlayer('player1');
      gameState.board.cells[1][1].setMarkedByPlayer('player1');
      gameState.board.cells[2][1].setMarkedByPlayer('player1');

      const status = checkGameStatus(gameState);
      expect(status?.player).toBe('player1');
    });

    test('Vertical third column', () => {
      const gameState = p5Instance.gameState;
      gameState.board.cells[0][2].setMarkedByPlayer('player1');
      gameState.board.cells[1][2].setMarkedByPlayer('player1');
      gameState.board.cells[2][2].setMarkedByPlayer('player1');

      const status = checkGameStatus(gameState);
      expect(status?.player).toBe('player1');
    });

    test('Diagonal top-left to bottom-right', () => {
      const gameState = p5Instance.gameState;
      gameState.board.cells[0][0].setMarkedByPlayer('player1');
      gameState.board.cells[1][1].setMarkedByPlayer('player1');
      gameState.board.cells[2][2].setMarkedByPlayer('player1');

      const status = checkGameStatus(gameState);
      expect(status?.player).toBe('player1');
    })

    test('Diagonal top-right to bottom-left', () => {
      const gameState = p5Instance.gameState;
      gameState.board.cells[0][2].setMarkedByPlayer('player1');
      gameState.board.cells[1][1].setMarkedByPlayer('player1');
      gameState.board.cells[2][0].setMarkedByPlayer('player1');

      const status = checkGameStatus(gameState);
      expect(status?.player).toBe('player1');
    })
  });
});
