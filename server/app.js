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

function defense([combination],pos) {
    combination = combination.split('')
    pos = pos.split('')
    const defTurn = combination.filter(e => !~pos.indexOf(e))
    return +defTurn[0]
}

//Ищет наиболее подходящую на данный момент комбинацию(переписать под поиск одной наиболее подходящей из списка доступных)
function searchForWinCombination(combos,pos,requiredMatches) {
    let posArr = pos.split('')
    return combos.filter(combo => {
        let matchCount = 0
        let arr = combo.split('')
        arr.forEach(num => {
            posArr.indexOf(num) !== -1 ? matchCount++ : null
        })
        return matchCount >= requiredMatches
    })
}

function tryToWin(currentState) {
    console.log('im trying')
    let state = currentState.gameState
    let AIPos = []
    let freePos = []
    for (let key in state) {
        state[key] === 'O' ? AIPos.push(key) : null
        state[key] === '' ? freePos.push(key) : null
    }

    let freeAndAIPos = freePos.concat(AIPos)

    //Ищем доступные комбинации с учетом свободных и занятых компьютером клеток(вынести в ф-цию)
    let availableCombos = WIN_COMBINATIONS.filter(combo => {
        let matchCount = 0
        let arr = combo.split('')
        arr.forEach(num => {
            freeAndAIPos.indexOf(num) !== -1 ? matchCount++ : null
        })
        return matchCount > 2
    })
    console.log(availableCombos)
    let AIPotentialWin = searchForWinCombination(availableCombos,AIPos.join(),2)
    AIPotentialWin.length === 0 ? AIPotentialWin = searchForWinCombination(availableCombos,AIPos.join(),1) : null
    console.log(AIPotentialWin)

    const offTurn = AIPotentialWin[0].split('').filter(e => !~AIPos.indexOf(e))
    return +offTurn[0]
}

function secondTurnHandler(playersPos, currentState) {
    let state = currentState.gameState
    let AITurn
    let AIPos = []
    for (let key in state) {
        state[key] === 'O' ? AIPos.push(key) : null
    }
    let pos = playersPos.join('') // По идее нужно вынести в функцию защиты и поиска опасности
    let potentialLose = searchForWinCombination(WIN_COMBINATIONS,pos,2)

    //Если не грозит поражение на следующий ход,пытаемся найти свою комбинацию
    AITurn = potentialLose.length === 0 ? tryToWin(currentState) :
        potentialLose[0].includes(AIPos[0]) ? tryToWin(currentState) : defense(potentialLose,pos)

    return currentState.gameState[AITurn] = 'O'
}


function thirdTurnHandler(playersPos, currentState) {
    let AITurn
    let state = currentState.gameState
    let freePos = []
    let AIPos = []
    for (let key in state) {
        state[key] === '' ? freePos.push(key) : null
        state[key] === 'O' ? AIPos.push(key) : null
    }

    let freeAndPlayersPos = freePos.concat(playersPos.join('').split(''))
    let freeAndAIPos = freePos.concat(AIPos)
    //Ищем доступные игроку и компьютеру комбинации для победы
    let availableForPlayerCombos = availableCombinations(freeAndPlayersPos)
    let availableForAICombos = availableCombinations(freeAndAIPos)
    let pos = playersPos.join('') // По идее нужно вынести в функцию защиты и поиска опасности
    let potentialLose = searchForWinCombination(availableForPlayerCombos,pos,2)
    let potentialWin = searchForWinCombination(availableForAICombos,AIPos.join(''),2)
    console.log(potentialWin,potentialLose)
    AITurn = potentialWin.length !== 0 ? tryToWin(currentState) :
        potentialLose.length !== 0 ? defense(potentialLose,pos) : freePos[0]

    return currentState.gameState[AITurn] = 'O'
}

function checkForResult(currentState) {
    let state = currentState.gameState
    let playersPos = []
    let AIPos = []
    let freePos = []
    for (let key in state) {
        state[key] === 'X' ? playersPos.push(key) : null
        state[key] === 'O' ? AIPos.push(key) : null
        state[key] === '' ? freePos.push(key) : null
    }
    let playerWins = availableCombinations(playersPos)
    let AIWins = availableCombinations(AIPos)
    AIWins.length !== 0 ? currentState.result = 'defeat' : null
    playerWins.length !== 0 ? currentState.result = 'win' : null
    freePos.length < 2 && currentState.result === 'not finished' ? currentState.result = 'tie' : null
}

//Ищет все доступные комбинации
function availableCombinations(pos) {
    return  WIN_COMBINATIONS.filter(combo => {
        let matchCount = 0
        let arr = combo.split('')
        arr.forEach(num => {
            pos.indexOf(num) !== -1 ? matchCount++ : null
        })
        return matchCount > 2
    })
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
            checkForResult(currentState)
            break;
        case 4:
            thirdTurnHandler(playersPos, currentState)
            checkForResult(currentState)
            break;
        default:
            return currentState;

    }
    io.sockets.in(room).emit('AITurn', currentState);
    currentGame = currentState;
}

let currentGame = {}

let currentRoom

io.on('connection', socket => {
    currentRoom ? socket.join(currentRoom) : null
    console.log('client ready')
    socket.on('room', room => {
        currentRoom = room
        socket.join(room)
        io.sockets.in(room).emit('newGame', newField);
        currentGame = newField
    })
    socket.on('turn', turn => {
        currentGame = turn
        computerThinkingAbout(turn, currentRoom)})
    socket.on('disconnect',() => {
        GamesCtrl.saveGame(currentGame)

        console.log('client has gone ' + currentRoom)

    })
    socket.on('endGame',(game) => {
        //GamesCtrl.saveGame(game)
        socket.disconnect()
        currentRoom = null
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