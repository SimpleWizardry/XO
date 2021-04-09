import firstTurnHandler from "./turns/firstTurn.js";
import secondTurnHandler from "./turns/secondTurn.js";
import thirdTurnHandler from "./turns/thirdTurn.js";
import checkForResult from "./helpers/resultChecking.js";

export default function computerThinkingAbout(io, currentState, room, currentGame) {
    let state = currentState.gameState
    let playersPos = []
    for (let key in state) {
        state[key] === 'X' ? playersPos.push(+key) : null
    }
    switch (playersPos.length) {
        case 1 :
            firstTurnHandler(playersPos, currentState)
            break;
        case 2:
            secondTurnHandler(playersPos, currentState)
            break;
        case 3:
            thirdTurnHandler(playersPos, currentState)
            checkForResult(currentState)
            break;
        case 4:
            thirdTurnHandler(playersPos, currentState)
            checkForResult(currentState)
            break;
        default:
            return currentState;

    }
    io.sockets.in(room).emit('AITurn', currentState);
    currentGame = currentState;
}