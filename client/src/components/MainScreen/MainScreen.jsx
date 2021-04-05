import React, {useState, useEffect} from 'react';
import './mainscreen.scss';
import GameHistory from "../GamesHistory/GameHistory";
import {GameField} from "../GameField/GameField";
import axios from "axios";
import io from "socket.io-client";

//const socket = io(window.location.origin.replace("3000", "3005"));
const socket = io("http://localhost:3005");

export default function MainScreen() {
    const [gameStarted, setGameStarted] = useState(false)
    const [gameHistory, setGameHistory] = useState([])

    useEffect(() => {
        // socket.on("connect", () => {
        //     console.log('connected')
        //     socket.emit(JSON.stringify({type: 'ping'}))
        // })
        axios.defaults.baseURL = window.location.origin;
        window.axios = axios;
        axios.get('http://localhost:3005/games')
            .then(res => {
                setGameHistory(res.data)
            })
        },
        [])

    const clickHandler = ( ) => {
        setGameStarted(true)
        socket.emit('turn',{
            1: '',
            2: 'X',
            3: '',
            4: 'O',
            5: '',
            6: '',
            7: '',
            8: '',
            9: ''
        })
    }

    return (
        <div className='container'>
            <div className='screen'>
                <div>
                    {gameStarted ?
                        <GameField /> :
                        //<button onClick={() => setGameStarted(true)}>НАЧАТЬ</button>
                        <button onClick={clickHandler}>НАЧАТЬ</button>
                    }
                </div>
            </div>
            <div>
                <GameHistory gameHistoryArr={gameHistory}/>
            </div>
        </div>
    )
}