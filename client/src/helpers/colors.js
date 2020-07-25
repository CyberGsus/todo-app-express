/**
 * @param {Array} array
 */
const groupBy = (array, radix = 2) => {
  if (radix === 0) return []
  const finalArray = array.slice()
  if (radix < 0) {
    radix *= -1
    finalArray.reverse()
  }
  return finalArray.map((_, i) => finalArray.slice(i, i + radix))
}
export const getColorLightness = color => {
  if (!/^#(?:[0-9a-f]{1,2}){3}$/i.test(color)) {
    color = '#ff0000'
  }
  return (color.length === 4
    ? [...color.slice(1)].map(i => i.repeat(2))
    : groupBy([...color.slice(1)], 2).map(a => a.join(''))
  )
    .map(s => parseInt(s, 16))
    .map((_, i, arr) => (i < 2 ? arr.slice() : null))
    .slice(0, 2)
    .map((arr, i) => Math[['max', 'min'][i % 2]].apply(null, arr))
    .reduce((a, b, i) => (a + b) / (i + 1), 0)
}
