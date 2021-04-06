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

function firstTurnHandler(playersPos, currentState) {
    let [ pos ] =  playersPos
    //Всегда стараемся занять центр, иначе угловую клетку
    return pos === 5 ? currentState.gameState[getRandomOdd(1,9)] = 'O' : currentState.gameState[5] = 'O'
}

const WIN_COMBINATIONS = ['123','456','789','147','258','369','159','357']

function defense(combination,pos) {
    combination = combination.split('')
    pos = pos.split('')
    const defTurn = combination.filter(e => !~pos.indexOf(e))
    return +defTurn[0]
}

//Не отрабатывает после 2 хода, переписать для посимвольного сравнения
function searchForWinCombination(combos,pos) {
    console.log(pos)
     return combos.find(combo => {
        if (combo.includes(pos)) {
            return combo
        }
        else if (combo.startsWith(pos[0]) && combo.endsWith(pos[1])) {
            return combo
        }
    })
}

function tryToWin(currentState) {
    let state = currentState.gameState
    let AIPos = []
    let freePos = []
    for (let key in state) {
        state[key] === 'O' ? AIPos.push(key) : null
        state[key] === '' ? freePos.push(key) : null
    }

    let freeAndAIPos = freePos.concat(AIPos)

    //Ищем доступные комбинации с учетом свободных и занятых компьютером клеток
    let availableCombos = WIN_COMBINATIONS.filter(combo => {
        let matchCount = 0
        let arr = combo.split('')
        arr.forEach(num => {
            freeAndAIPos.indexOf(num) !== -1 ? matchCount++ : null
        })
        return matchCount > 2
    })
    let AIPotentialWin = searchForWinCombination(availableCombos,AIPos)
    const offTurn = AIPotentialWin.split('').filter(e => !~AIPos.indexOf(e))
    return +offTurn[0]
}

function secondTurnHandler(playersPos, currentState) {
    let AITurn
    let pos = playersPos.join('') // По идее нужно вынести в функцию защиты и поиска опасности
    let potentialWin = searchForWinCombination(WIN_COMBINATIONS,pos)

    //Если не грозит поражение на следующий ход,пытаемся найти свою комбинацию
    AITurn = potentialWin === undefined ? tryToWin(currentState) : defense(potentialWin,pos)

    return currentState.gameState[AITurn] = 'O'
}

function thirdTurnHandler(playersPos, currentState) {
    let AITurn
    let pos = playersPos.join('') // По идее нужно вынести в функцию защиты и поиска опасности
    let potentialWin = searchForWinCombination(WIN_COMBINATIONS,pos)
    console.log(potentialWin)
}

function computerThinkingAbout(currentState, room) {
    let state = currentState.gameState
    // Вынести в соответствующие ф-ции
    let playersPos = []
    for (let key in state) {
        state[key] === 'X' ? playersPos.push(+key) : null
    }
    switch (playersPos.length) {
        case 1 :
            firstTurnHandler(playersPos, currentState)
            break;
        case 2:
            secondTurnHandler(playersPos, currentState)
            break;
        case 3:
            thirdTurnHandler(playersPos, currentState)
            break;
        default:
            return currentState;

    }
    io.sockets.in(room).emit('AITurn', currentState);
    currentGame = currentState;
}

let currentGame = {}

io.on('connection', socket => {
    console.log('client ready')
    socket.on('room', room => {
        socket.join(room)
        console.log('new room', room)
        io.sockets.in(room).emit('newGame', newField);

        socket.on('turn', turn => computerThinkingAbout(turn, room))
    })
    socket.on('disconnect',() => {
        //GamesCtrl.saveGame(currentGame)

        console.log('client has gone')

    })
    socket.on('disconnecting', () => console.log('wtf',socket.rooms))

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