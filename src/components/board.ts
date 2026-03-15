import type { Cell } from './cell.ts';

export class Board {
  private boardCells: Cell[] = [];

  constructor() {}

  getPlayersCell(player: Player) {
    return this.boardCells.filter((cell) => cell.ownedByPlayer === player);
  }

  addCell(cell: Cell[]) {
    this.boardCells.push(...cell);
  }

  checkWinner() {
    const p1Hits = this.getPlayersCell('player1');
    const p1Sum = p1Hits.reduce((acc, cell) => acc + cell.magicNumber, 0);

    if (p1Sum === 15) return 'player1';

    const p2Hits = this.getPlayersCell('player2');
    const p2Sum = p2Hits.reduce((acc, cell) => acc + cell.magicNumber, 0);

    if (p2Sum === 15) return 'player2';

    return null;
  }
}
