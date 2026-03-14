import p5 from "p5";
import {changePlayer, Player} from "../helper.ts";
import {BOX_SIZE} from "../env.ts";

export type BoxProps = {
    nr: number, x: number, y: number, diameter?: number, onClicked?: () => void
};
export const Box = (p: p5, {nr, x, y, diameter = BOX_SIZE, onClicked}: BoxProps): GameObject => {
    let marked = false
    let mouseOver = false

    let mousePressed = false

    let takenByPlayer: typeof window.currentPlayer

    const isMouseOver = () => {
        const {mouseX, mouseY} = p

        return mouseX >= x &&
            mouseX <= x + diameter &&
            mouseY >= y &&
            mouseY <= y + diameter
    }

    document.addEventListener('onMousePressed', () => {
        mousePressed = true
    })

    document.addEventListener('onMouseReleased', () => {
        mousePressed = false
    })

    const onUpdate = () => {
        mouseOver = isMouseOver()

        if (mouseOver && mousePressed) {
            marked = !marked
            onClicked?.()

            takenByPlayer = window.currentPlayer

            document.dispatchEvent(new CustomEvent('onBoxPressed', {
                detail: {
                    boxNr: nr,
                    Player: takenByPlayer,
                }
            }))

            changePlayer()
        }
    }

    const onDraw = () => {
        p.push()

        if (mouseOver) {
            p.stroke(Player.Color[window.currentPlayer])
            p.strokeWeight(3)
        }

        p.square(x, y, diameter)
        p.pop()

        p.push()
        p.fill(Player.Color[takenByPlayer])
        p.textFont('Arial', 20)
        p.textAlign('center', 'center')

        const getText = () => {
            if (marked) {
                return `${Player.Symbol[takenByPlayer]}`
            }

            return ''
        }
        p.text(getText(), x, y, diameter, diameter)
        p.pop()

        p.stroke(0)
        p.strokeWeight(1)
    }

    return {
        get takenByPlayer() {
            return takenByPlayer
        },
        onUpdate,
        onDraw
    }
}
