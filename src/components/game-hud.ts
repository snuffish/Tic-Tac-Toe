import p5 from "p5";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../env.ts";
import {COLOR, Player} from "../helper.ts";

export const GameHud = (p: p5): GameObject => {
    let text = ''
    let color: RGB = COLOR.NONE

    const onUpdate = () => {
        text = Player.Name[window.currentPlayer]
    }

    const onDraw = () => {
        p.push()
        p.textAlign('center')

        p.fill(color)

        const bounds = p.textBounds(text, 0, CANVAS_HEIGHT * 0.85, CANVAS_WIDTH)
        p.text(text, 0, bounds.y, CANVAS_WIDTH)
        p.pop()
    }

    return {
        onDraw,
        onUpdate
    }
}
