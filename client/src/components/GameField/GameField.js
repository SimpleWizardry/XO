import React from 'react';
import './gameField.scss'

export const GameField = ({field, makeAMove, wrongTurn}) => {
    //console.log(field)
    return (
        <>

            <div className='game-field'>
                {Object.keys(field).map(key =>
                    <div
                        className='game-field--cell'
                        key={key}
                        id={key}
                        onClick={field[key] ? wrongTurn : makeAMove}
                    >
                        {field[key]}
                    </div>
                )
                }
            </div>
        </>
    )
}