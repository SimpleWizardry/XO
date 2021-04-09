//Ищет все доступные комбинации
import {WIN_COMBINATIONS} from "../../../constants/constants.js";

export default function availableCombinations(pos) {
    return  WIN_COMBINATIONS.filter(combo => {
        let matchCount = 0
        let arr = combo.split('')
        arr.forEach(num => {
            pos.indexOf(num) !== -1 ? matchCount++ : null
        })
        return matchCount > 2
    })
}