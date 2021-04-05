import React, {useState, useEffect} from 'react';
import './mainscreen.scss';
import GameHistory from "../GamesHistory/GameHistory";
import {GameField} from "../GameField/GameField";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3005", {autoConnect: false});

export default function MainScreen() {
    const [gameStarted, setGameStarted] = useState(false)
    const [gameHistory, setGameHistory] = useState([])
    const [field,setField] = useState({})

    useEffect(() => {
        axios.defaults.baseURL = window.location.origin;
        window.axios = axios;
        axios.get('/games')
            .then(res => {
                setGameHistory(res.data)
            })
        },
        [])

    const clickHandler = ( ) => {
        socket.connect()
        socket.on('connect', () => {
            socket.emit('room', 'newRoom');
        })
        socket.on('newGame', newField => {
            setField(newField)
            setGameStarted(true)
        });

    }

    const moveHandler = (e) => {
        let cellNumber = e.target.id
        let myTurn = {...field}
        myTurn.gameState[cellNumber] = 'X'
        setField(myTurn)
        socket.emit('turn', myTurn);
    }

    return (
        <div className='container'>
            <div className='screen'>
                <div>
                    {gameStarted ?
                        <GameField
                            field={field.gameState}
                            makeAMove={moveHandler}
                        /> :
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