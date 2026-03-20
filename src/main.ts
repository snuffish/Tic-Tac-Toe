// @ts-ignore
import './style.css'
import { mountSnake } from './snake.ts';

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
    throw new Error('App container not found')
}

app.innerHTML = '<div id="p5-container"></div>'

const container = document.querySelector<HTMLElement>('#p5-container')

if (!container) {
    throw new Error('p5 container not found')
}

// mountTicTacToe(container)
mountSnake(container)