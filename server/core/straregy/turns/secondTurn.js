import {WIN_COMBINATIONS} from "../../../constants/constants.js";
import searchForWinCombination from "../helpers/searchForWinCombination.js";
import tryToWin from "../AIAction/tryToWin.js";
import defense from "../AIAction/defense.js";

export default function secondTurnHandler(playersPos, currentState) {
    let state = currentState.gameState
    let AITurn
    let AIPos = []
    for (let key in state) {
        state[key] === 'O' ? AIPos.push(key) : null
    }
    let pos = playersPos.join('') // По идее нужно вынести в функцию защиты и поиска опасности
    let potentialLose = searchForWinCombination(WIN_COMBINATIONS,pos,2)

    //Если не грозит поражение на следующий ход,пытаемся найти свою комбинацию
    AITurn = potentialLose.length === 0 ? tryToWin(currentState) :
        potentialLose[0].includes(AIPos[0]) ? tryToWin(currentState) : defense(potentialLose,pos)

    return currentState.gameState[AITurn] = 'O'
}