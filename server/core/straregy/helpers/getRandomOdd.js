export default function getRandomOdd(min,max) {
    let num = Math.round(min+Math.random() * (max-min));
    return num%2 !== 0 && num !== 5 ? num : getRandomOdd(min, max);
}