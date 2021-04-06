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
    const [field,setField] = useState({gameState:{}})
    const [wrongTurn, setWrongTurn] = useState(false)
    //const [wsConnection, setWsConnection] = useState(false)

    useEffect(() => {
        axios.get('/games')
            .then(res => {
                setGameHistory(res.data)
            })
        axios.get('/game')
            .then(res => {
                if (res.data.length !== 0) {
                    setField(res.data[0])
                    setGameStarted(true)
                    socket.connect()
                }
            })
            .catch(err => console.log(err))
    }, [])

    const clickHandler = ( ) => {
        socket.connect()
        socket.on('connect', () => {
            socket.emit('room', 'newRoom');
        })
        socket.on('newGame', newField => {
            setField(newField)
            setGameStarted(true)
        });
        socket.on('AITurn', AITurn => setField(AITurn))
        socket.on('disconnecting', () => console.log(socket.rooms))
    }

    // useEffect(() => {
    //     socket.on('AITurn', AITurn => setField(AITurn))
    // })


    const moveHandler = (e) => {
        let cellNumber = e.target.id
        let myTurn = {...field}
        myTurn.gameState[cellNumber] = 'X'
        setField(myTurn)
        socket.emit('turn', myTurn);
    }

    const wrongTurnHandler = (e) => {
        setWrongTurn(true)
        setTimeout(() => setWrongTurn(false),1000)
    }

    return (
        <div className='container'>

            <div className='screen'>

                { wrongTurn? <div className='wrong-turn'>недопустимый ход</div> : null }

                <div>
                    {gameStarted ?
                        <GameField
                            field={field.gameState}
                            makeAMove={moveHandler}
                            wrongTurn={wrongTurnHandler}
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
// <div onClick={() => console.log(field)}>CHECK</div>