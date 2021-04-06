import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import GamesController from './controllers/GamesController.js';


const app = express();
const http = createServer(app);
const io = new Server (http, {
    cors: 'http://localhost:3000'
})

const newField = {
    gameState: {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: ''
    },
    result: 'not finished'
}

function getRandomOdd(min,max) {
    let num = Math.round(min+Math.random() * (max-min));
    return num%2 !== 0 && num !== 5 ? num : getRandomOdd(min, max);
}

function firstTurnHandler(enemiesPos, turn) {
    let [ pos ] =  enemiesPos
    //Всегда стараемся занять центр, иначе угловую клетку
    return pos === 5 ? turn.gameState[getRandomOdd(1,9)] = 'O' : turn.gameState[5] = 'O'
}

const WIN_COMBINATIONS = ['123','456','789','147','258','369','159','357']

function secondTurnHandler(enemiesPos, turn) {
    let pos = enemiesPos.join('')
    let potentialWin = WIN_COMBINATIONS.find(combo => {
        return combo.includes(pos)
    })
    let AITurn = +potentialWin.replace(pos, '')
    return turn.gameState[AITurn] = 'O'
}

function thirdTurnHandler(enemiesPos, turn) {
    let pos = enemiesPos.join('')
    //console.log(pos)

    // let potentialWin = WIN_COMBINATIONS.find(combo => {
    //     return combo.includes(pos)
    // })
    // let AITurn = +potentialWin.replace(pos, '')
    // return turn.gameState[AITurn] = 'O'
}

function computerThinkingAbout(turn, room) {
    let state = turn.gameState
    let enemiesPos = []
    for (let key in state) {
        state[key] === 'X' ? enemiesPos.push(+key) : null
    }
    switch (enemiesPos.length) {
        case 1 :
            firstTurnHandler(enemiesPos, turn)
            break;
        case 2:
            secondTurnHandler(enemiesPos, turn)
            break;
        case 3:
            thirdTurnHandler(enemiesPos, turn)
            break;
        default:
            return turn;

    }
    io.sockets.in(room).emit('AITurn', turn);
}


io.on('connection', socket => {
    console.log('client ready')
    socket.on('room', room => {
        socket.join(room)
        io.sockets.in(room).emit('newGame', newField);

        socket.on('turn', turn => computerThinkingAbout(turn, room))
    })

})

const PORT = 3005;

mongoose.connect('mongodb+srv://testUser:test123pass@mycluster.ehxqa.mongodb.net/tic-tac-toe?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

const GamesCtrl = new GamesController();

app.use(cors());

app.get('/game', GamesCtrl.continueGame)
app.get('/games', GamesCtrl.getGames)
app.post('/game/save', GamesCtrl.saveGame)

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB'));

http.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
});