import getRandomOdd from "../helpers/getRandomOdd.js";

export default function firstTurnHandler(playersPos, currentState) {
    let [ pos ] =  playersPos
    //Всегда стараемся занять центр, иначе угловую клетку
    return pos === 5 ? currentState.gameState[getRandomOdd(1,9)] = 'O' : currentState.gameState[5] = 'O'
}