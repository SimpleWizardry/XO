import GameModel from "../models/Game.js";
import mongoose from 'mongoose'

class GamesController {
    getGames = (req, res) => {
        GameModel.find({ $or: [ { result: 'win' }, { result: 'defeat' }, { result: 'tie' } ] } , (err, game) => {
            err ? console.log(err) : res.json(game)
        })
    }
    continueGame = ( req, res) => {
        GameModel.find({ result: 'not finished' }, (err, game) => {
            !game ? res.json('no such games') : res.json(game)
        })
    }
    saveGame = (game) => {
        let query = {_id: game._id}
        if (!query._id) {
            query._id = new mongoose.mongo.ObjectID();
        }
        GameModel.findOneAndUpdate(query, game,{upsert: true},(err, game) => {
            err ? console.log(err) : console.log(game + 'saved')
        })
    }
}

export default GamesController;