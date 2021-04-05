import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema ({
    // state: {
    //     1: String,
    //     2: String,
    //     3: String,   default: "notsent"
    //     4: String,
    //     5: String,
    //     6: String,
    //     7: String,
    //     8: String,
    //     9: String
    // },
    // result: String
    state: {
        1: {type: String, default: ""},
        2: {type: String, default: ""},
        3: {type: String, default: ""},
        4: {type: String, default: ""},
        5: {type: String, default: ""},
        6: {type: String, default: ""},
        7: {type: String, default: ""},
        8: {type: String, default: ""},
        9: {type: String, default: ""}
    },
    result: {type: String, default: "not finished"}
});

const GameModel = mongoose.model('Game', gameSchema);

export default GameModel;