import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import GamesController from './controllers/GamesController.js';

const GamesCtrl = new GamesController();

const PORT = 3005;



const app = express();
const http = createServer(app);
const io = new Server(http, {
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on('connection',socket => {
    console.log('client ready')
    //socket.on('disconnect', GamesCtrl.saveGame)
    socket.on('turn', data => {
        console.log('turn',data)
    })

})

app.use(cors())


mongoose.connect('mongodb+srv://testUser:test123pass@mycluster.ehxqa.mongodb.net/tic-tac-toe?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

//app.use(cors());

app.get('/games', GamesCtrl.getGames)
app.post('/games/new', GamesCtrl.createGame)

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB'));

http.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
});
