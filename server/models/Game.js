import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema ({
    gameState: {
        1: String,
        2: String,
        3: String,
        4: String,
        5: String,
        6: String,
        7: String,
        8: String,
        9: String
    },
    result: String
});

const GameModel = mongoose.model('Game', gameSchema);

export default GameModel;