import { Server } from 'socket.io';
import {NEW_FIELD} from "../constants/constants.js";
import computerThinkingAbout from "./straregy/main.js";
import GamesController from "../controllers/GamesController.js";

export default (http) => {
    const io = new Server(http, {
        cors: 'http://localhost:3000'
    })

    const GamesCtrl = new GamesController(); //Пофиксить

    let currentGame = {}
    let currentRoom

    io.on('connection', socket => {
        currentRoom ? socket.join(currentRoom) : null
        console.log('client ready')
        socket.on('room', room => {
            currentRoom = room
            socket.join(room)
            io.sockets.in(room).emit('newGame', NEW_FIELD);
            currentGame = NEW_FIELD
        })
        socket.on('turn', turn => {
            currentGame = turn
            computerThinkingAbout(io, turn, currentRoom, currentGame) //Пофиксить
        })
        socket.on('disconnect',() => {
            GamesCtrl.saveGame(currentGame)

            console.log('client has gone ' + currentRoom)

        })
        socket.on('endGame',(game) => {
            socket.disconnect()
            currentRoom = null
        })
    })
}