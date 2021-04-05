import React, {useState} from 'react';
import './gameField.scss'

// const game = {
//     1: '',
//     2: 'X',
//     3: '',
//     4: 'O',
//     5: '',
//     6: '',
//     7: '',
//     8: '',
//     9: ''
// }

export const GameField = ({field, makeAMove}) => {
    const [wrongTurn, setWrongTurn] = useState(false)

    const wrongTurnHandler = (e) => {
        setWrongTurn(true)
        setTimeout(() => setWrongTurn(false),1000)
    }

    return (
        <>
            { wrongTurn? <div className='wrong-turn'>недопустимый ход</div> : null }
            <div className='game-field'>
                {Object.keys(field).map(key =>
                    <div
                        className='game-field--cell'
                        key={key}
                        id={key}
                        onClick={field[key] ? wrongTurnHandler : makeAMove}
                    >
                        {field[key]}
                    </div>
                )
                }
            </div>
        </>
    )
}