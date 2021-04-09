import availableCombinations from "./availableCombinations.js";

export default function checkForResult(currentState) {
    let state = currentState.gameState
    let playersPos = []
    let AIPos = []
    let freePos = []
    for (let key in state) {
        state[key] === 'X' ? playersPos.push(key) : null
        state[key] === 'O' ? AIPos.push(key) : null
        state[key] === '' ? freePos.push(key) : null
    }
    let playerWins = availableCombinations(playersPos)
    let AIWins = availableCombinations(AIPos)
    AIWins.length !== 0 ? currentState.result = 'defeat' : null
    playerWins.length !== 0 ? currentState.result = 'win' : null
    freePos.length < 2 && currentState.result === 'not finished' ? currentState.result = 'tie' : null
}