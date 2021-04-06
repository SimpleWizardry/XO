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
    saveGame = (req, res) => {
        //const gameToSave = req.toJSON
        const gameToSave = req.body
        console.log(req,gameToSave)
        // gameToSave
        //     .save()
        //     .then(() => console.log(req,res))
    }
}

export default GamesController;