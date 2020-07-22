const color1 = '#ff00ff'
const color2 = 'white'
const color3 = '#ffc'

const cssColors = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7dffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue
}

const isDark = (color) => {
  console.log('Analyzing color')
  if (!/(?:[0-9a-f]{3}){1,2}/i.test(color)) {
    console.log('CSS color', color)
  } else {
    console.log('HEX color:', color)
  }
  return false
}

console.log(isDark(color1))
console.log(isDark(color2))
