import React from 'react';
import './gameField.scss'

const game = {
    1: '',
    2: 'X',
    3: '',
    4: 'O',
    5: '',
    6: '',
    7: '',
    8: '',
    9: ''
}

export const GameField = ( ) => {

    const wrongTurnHandler = () => {
        alert('неверный ход')
    }

    const makeAMove = () => {
        alert('Рисую крестик')
    }

    return (
        <div className='game-field'>
            {Object.keys(game).map(key =>
                //console.log(key, game[key])
                <div
                    className='game-field--cell'
                    key={key}
                    id={key}
                    onClick={game[key] ? wrongTurnHandler : makeAMove}
                >
                    {game[key]}
                </div>
            )
            }
        </div>
    )
}