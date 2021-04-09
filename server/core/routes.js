import GamesController from "../controllers/GamesController.js";

export default (app) => {
    const GamesCtrl = new GamesController();

    app.get('/game', GamesCtrl.continueGame)
    app.get('/games', GamesCtrl.getGames)
    app.post('/game/save', GamesCtrl.saveGame)
}