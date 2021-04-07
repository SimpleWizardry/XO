import React from 'react';
import './gameField.scss'

export const GameField = ({field, makeAMove, wrongTurn, startAgain}) => {
    return (
        <>
            {field.result === 'not finished' ?
                <div className='game-field'>
                    {Object.keys(field.gameState).map(key =>
                        <div
                            className='game-field--cell'
                            key={key}
                            id={key}
                            onClick={field.gameState[key] ? wrongTurn : makeAMove}
                        >
                            {field.gameState[key]}
                        </div>
                    )
                    }
                </div>
                :
                <>
                    <div className='end-game--result'>Результат: {field.result === 'win' ? 'победа' :
                                                                    field.result === 'defeat' ? 'поражение' :
                                                                        field.result === 'tie'? 'ничья' : null}
                    </div>
                    <div className='small-field'>
                        {Object.keys(field.gameState).map(key =>
                            <div
                                className='small-field--cell'
                                key={key}
                            >
                                {field.gameState[key]}
                            </div>
                        )
                        }
                    </div>
                    <button
                        onClick={startAgain}
                        className='play-again'
                    >
                        Играть еще раз
                    </button>
                </>
            }
        </>
    )
}