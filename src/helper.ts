export const changePlayer = () => {
    window.currentPlayer = window.currentPlayer === 'player1' ? 'player2' : 'player1'
}

export const COLOR: Record<Color, RGB> = {
    NONE: [0, 0, 0],
    RED: [255, 0, 0],
    GREEN: [0, 255, 0],
    BLUE: [0, 0, 255]
}

export const Player = {
    Name: {
        player1: 'Player 1',
        player2: 'Player 2'
    },
    Symbol: {
        player1: 'X',
        player2: 'O'
    } as Record<Player, string>,
    Color: {
        player1: COLOR.GREEN,
        player2: COLOR.RED
    } as Record<Player, RGB>
}

