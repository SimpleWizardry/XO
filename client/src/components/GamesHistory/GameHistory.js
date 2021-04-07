import React from 'react';
import './gamehistory.scss'

export default function GameHistory({gameHistoryArr}) {
    return (
        <div className='game-history'>
            <h1>ИСТОРИЯ ИГР:</h1>
            <ul>
                {gameHistoryArr.map((game, index) =>
                    <li key={game._id} className={'game-result__' + game.result}>
                        Игра номер {index + 1} : {game.result === 'win' ? 'победа' :
                                                    game.result === 'defeat' ? 'поражение' :
                                                        game.result === 'tie'? 'ничья' : null}
                    </li>
                )}
            </ul>
        </div>
    )
}