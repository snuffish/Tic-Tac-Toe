import p5 from 'p5'
import {BOX_SIZE, CANVAS_HEIGHT, CANVAS_WIDTH} from "./env.ts";
import {Box} from "./components/box.ts";

const Game = (p: p5) => {
    const createBoxes = ({origin}: { origin: { x: number, y: number } }) => {
        let currentRow = 1
        return Array.from({length: 9}).map((_, i) => {
            const isNewRow = (i: number) => (i === 0 || i === 3 || i === 6)
            if (isNewRow(i)) {
                currentRow++
            }

            const x = origin.x + (i % 3) * (BOX_SIZE + 1)
            const y = origin.y + (currentRow * (BOX_SIZE + 1))
            return Box(p, {
                nr: i,
                x,
                y,
                diameter: BOX_SIZE,
            })
        })
    }

    const Boxes = createBoxes({origin: {x: 225, y: 0}})

    const renderItems: GameObject[] = Boxes

    const checkMatchStatus = () => {

    }

    const addItem = (...item: GameObject[]) => {
        renderItems.push(...item)
    }

    const render = () => renderItems.forEach(item => {
        item.onUpdate?.()

        if (p.isLooping()) {
            item.onDraw()
        }
    })

    const newGame = () => {
        // TODO: Reset and create new boxes
    }

    return {
        render,
        addItem,
        newGame
    }
}

const sketch = (p: p5) => {
    const game = Game(p)

    p.setup = () => {
        p.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)

        p.background(240)

        window.currentPlayer = 'player1'
        game.newGame()
    }

    p.draw = () => {
        p.push()
        p.background(240)

        game.render()
        p.pop()
    }

    p.mousePressed = () => {
        p.noLoop()
        document.dispatchEvent(new CustomEvent('onMousePressed'))
        window.mousePressed = true
    }

    p.mouseReleased = () => {
        p.loop()
        document.dispatchEvent(new CustomEvent('onMouseReleased'))
        window.mousePressed = false
    }
}

export function mountSketch(container?: HTMLElement) {
    return new p5(sketch, container)
}