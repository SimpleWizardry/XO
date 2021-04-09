//Ищет наиболее подходящую на данный момент комбинацию(переписать под поиск одной наиболее подходящей из списка доступных)
export default function searchForWinCombination(combos,pos,requiredMatches) {
    let posArr = pos.split('')
    return combos.filter(combo => {
        let matchCount = 0
        let arr = combo.split('')
        arr.forEach(num => {
            posArr.indexOf(num) !== -1 ? matchCount++ : null
        })
        return matchCount >= requiredMatches
    })
}