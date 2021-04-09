import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';

import newSocket from './core/socket.js'
import {PORT} from './constants/constants.js';
import newRoutes from './core/routes.js'

const app = express();
app.use(cors());
const http = createServer(app);
newSocket(http)
newRoutes(app)

mongoose.connect('mongodb+srv://testUser:test123pass@mycluster.ehxqa.mongodb.net/tic-tac-toe?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB'));

http.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
});