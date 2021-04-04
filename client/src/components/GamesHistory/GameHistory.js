import React from 'react';
import './gamehistory.scss'

const games = [ {id: '1',result: 'win'},
                {id: '2',result: 'win'},
                {id: '3',result: 'win'},
                {id: '4',result: 'defeat'},
                {id: '5',result: 'defeat'},
                {id: '6',result: 'win'},
                {id: '7',result: 'defeat'},
                ]


export default function GameHistory() {
    return (
        <div className='game-history'>
            <h1>ИСТОРИЯ ИГР:</h1>
            <ul>
                {games.map((game, index) =>
                    <li key={game.id} className={'game-result__' + game.result}>
                        Игра номер {index + 1} : {game.result === 'win' ? 'победа' : 'поражение' }
                    </li>
                )}
            </ul>
        </div>
    )
}