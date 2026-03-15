import p5 from 'p5';
import { associations, BOX_SIZE } from '../env.ts';
import { changePlayer } from '../helper.ts';

const Symbol = {
  player1: 'x',
  player2: 'O'
} as const;

export class Cell {
  private p: p5;
  magicNumber: number;
  ownedByPlayer: Player | null = null;

  private originX = 400;
  private originY = 200;

  private square: p5.Element;

  private row = 0;
  private col = 0;

  constructor(p: p5, magicNumber: number) {
    this.p = p;
    this.magicNumber = magicNumber;

    for (const [row, values] of Object.entries(associations.rows)) {
      if (values.includes(this.magicNumber)) {
        this.row = parseInt(row);
        break;
      }
    }

    for (const [col, values] of Object.entries(associations.cols)) {
      if (values.includes(this.magicNumber)) {
        this.col = parseInt(col);
        break;
      }
    }

    this.square = this.p.createDiv();

    this.square.mousePressed(() => {
      if (this.ownedByPlayer) return;

      this.ownedByPlayer = window.currentPlayer;
      changePlayer();
    });

    this.square.mouseOver(() => {
      this.square.style('background-color', 'yellow');
    });

    this.square.mouseOut(() => {
      this.square.style('background-color', 'transparent');
    });
  }

  show() {
    this.square.position(this.originX + (this.col * BOX_SIZE), this.originY + (this.row * BOX_SIZE));

    if (this.ownedByPlayer) {
      this.square.html(Symbol[this.ownedByPlayer]);
    }

    this.square.style('width', `${BOX_SIZE}px`);
    this.square.style('height', `${BOX_SIZE}px`);
    this.square.style('border', '1px solid black');
    this.square.style('box-sizing', 'border-box');
  }
}
