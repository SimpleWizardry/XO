import availableCombinations from "../helpers/availableCombinations.js";
import searchForWinCombination from "../helpers/searchForWinCombination.js";
import tryToWin from "../AIAction/tryToWin.js";
import defense from "../AIAction/defense.js";

export default function thirdTurnHandler(playersPos, currentState) {
    let AITurn
    let state = currentState.gameState
    let freePos = []
    let AIPos = []
    for (let key in state) {
        state[key] === '' ? freePos.push(key) : null
        state[key] === 'O' ? AIPos.push(key) : null
    }

    let freeAndPlayersPos = freePos.concat(playersPos.join('').split(''))
    let freeAndAIPos = freePos.concat(AIPos)
    //Ищем доступные игроку и компьютеру комбинации для победы
    let availableForPlayerCombos = availableCombinations(freeAndPlayersPos)
    let availableForAICombos = availableCombinations(freeAndAIPos)
    let pos = playersPos.join('') // По идее нужно вынести в функцию защиты и поиска опасности
    let potentialLose = searchForWinCombination(availableForPlayerCombos,pos,2)
    let potentialWin = searchForWinCombination(availableForAICombos,AIPos.join(''),2)
    console.log(potentialWin,potentialLose)
    AITurn = potentialWin.length !== 0 ? tryToWin(currentState) :
        potentialLose.length !== 0 ? defense(potentialLose,pos) : freePos[0]

    return currentState.gameState[AITurn] = 'O'
}