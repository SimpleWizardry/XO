import GameModel from "../models/Game.js";

class GamesController {
    getGames = (req, res) => {
        GameModel.find({ $or: [ { result: 'win' }, { result: 'defeat' } ] } , (err, game) => {
            err ? console.log(err) : res.json(game)
        })
    }
    // createGame = ( _ , res) => {
    //     const game = new GameModel();
    //     game
    //         .save()
    //         .then(() => console.log(res))
    // }
    // continueGame = ( req, res) => {
    //     GameModel.find({ result: 'not finished' }, (err, game) => {
    //         err ? res.json(err) : res.json(game)
    //     })
    // }
    continueGame = ( req, res) => {
        GameModel.find({ result: 'not finished' }, (err, game) => {
            !game ? res.json('no such games') : res.json(game)
        })
    }
    saveGame = (game) => {
         const gameToSave = new GameModel(game)
         gameToSave
             .save()
             .catch(reason => console.log(reason))
    }
}

export default GamesController;