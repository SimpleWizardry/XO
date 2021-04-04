const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const app = express();
const PORT = 3005;

mongoose.connect('mongodb+srv://<username>:<password>@mycluster.ehxqa.mongodb.net/tic-tac-toe?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

app.use(cors());

const dbConnection = mongoose.connection;
dbConnection.on('error', err => console.log(`Connection error: ${err}`));
dbConnection.once('open', () => console.log('Connected to DB'));

app.listen(PORT, err => {
    err ? console.log(err) : console.log('Server started!');
});