export default function defense([combination],pos) {
    combination = combination.split('')
    pos = pos.split('')
    const defTurn = combination.filter(e => !~pos.indexOf(e))
    return +defTurn[0]
}