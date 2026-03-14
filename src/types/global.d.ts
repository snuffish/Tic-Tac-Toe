import type {BoxProps} from "../components/box.ts";

declare module '*.css'

declare global {
    interface Window {
        mousePressed: boolean
        currentPlayer: Player
    }

    interface DocumentEventMap {
        onMousePressed: void
        onMouseReleased: void
        onBoxPressed: CustomEvent<{
            boxNr: BoxProps['nr'],
            player: Player
        }>
    }

    type RGB = [number, number, number]
    type Color = 'NONE' | 'RED' | 'GREEN' | 'BLUE'

    type Player = 'player1' | 'player2'

    type GameObject = {
        onDraw: () => void
        onUpdate?: () => void
        onMousePressed?: () => void
    }
}

export {}