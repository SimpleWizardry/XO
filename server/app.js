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

function computerThinkingAbout(turn, room) {
    let state = turn.gameState
    let enemiesPos = []
    for (let key in state) {
        state[key] === 'X' ? enemiesPos.push(+key) : null
    }
    console.log(enemiesPos.toString() === '1')
    switch (enemiesPos.toString()) {
        case '1' :
            turn.gameState[5] = 'O'
    }
    io.sockets.in(room).emit('mes', turn);
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

app.get('/games', GamesCtrl.getGames)

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB'));

http.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
});