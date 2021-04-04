import React, {useState} from 'react';
import './mainscreen.scss';
import GameHistory from "../GamesHistory/GameHistory";
import {GameField} from "../GameField/GameField";

export default function MainScreen() {
    const [gameStarted, setGameStarted] = useState(false)

    return (
        <div className='container'>
            <div className='screen'>
                <div>
                    {gameStarted ?
                        <GameField /> :
                        <button onClick={() => setGameStarted(true)}>НАЧАТЬ</button>
                    }
                </div>
            </div>
            <div>
                <GameHistory />
            </div>
        </div>
    )
}