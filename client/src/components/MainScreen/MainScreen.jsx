import React, {useState, useEffect} from 'react';
import './mainscreen.scss';
import GameHistory from "../GamesHistory/GameHistory";
import {GameField} from "../GameField/GameField";
import axios from "axios";

export default function MainScreen() {
    const [gameStarted, setGameStarted] = useState(false)
    const [gameHistory, setGameHistory] = useState([])

    useEffect(() => {
        axios.defaults.baseURL = window.location.origin;
        //axios.defaults.headers.common["token"] = window.localStorage.token;

        window.axios = axios;
        axios.get('/games')
            .then(res => {
                setGameHistory(res.data)
            })
        },
        [])
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
                <GameHistory gameHistoryArr={gameHistory}/>
            </div>
        </div>
    )
}