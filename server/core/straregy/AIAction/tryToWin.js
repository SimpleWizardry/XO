import searchForWinCombination from "../helpers/searchForWinCombination.js";
import availableCombinations from "../helpers/availableCombinations.js";

export default function tryToWin(currentState) {
    let state = currentState.gameState
    let AIPos = []
    let freePos = []
    for (let key in state) {
        state[key] === 'O' ? AIPos.push(key) : null
        state[key] === '' ? freePos.push(key) : null
    }

    let freeAndAIPos = freePos.concat(AIPos)
    let availableCombos = availableCombinations(freeAndAIPos)
    let AIPotentialWin = searchForWinCombination(availableCombos,AIPos.join(),2)
    AIPotentialWin.length === 0 ? AIPotentialWin = searchForWinCombination(availableCombos,AIPos.join(),1) : null

    const offTurn = AIPotentialWin[0].split('').filter(e => !~AIPos.indexOf(e))
    return +offTurn[0]
}