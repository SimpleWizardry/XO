import GameModel from "../models/Game.js";

class GamesController {
    getGames = (req, res) => {
        GameModel.find({ $or: [ { result: 'win' }, { result: 'defeat' } ] } , (err, game) => {
            err ? console.log(err) : res.json(game)
        })
    }
    createGame = ( _ , res) => {
        const game = new GameModel();
        game
            .save()
            .then(() => console.log(res))
    }
    continueGame = ( req, res) => {
        GameModel.find({ result: 'not finished' }, (err, game) => {
            err ? console.log(err) : res.json(game)
        })
    }
}

export default GamesController;