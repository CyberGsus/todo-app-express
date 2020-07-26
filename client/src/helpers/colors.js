/* http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/ */

/**
 * @param {Array} array
 */
const groupBy = (array, radix = 2) => {
  if (radix === 0) return []
  const finalArray = array.slice()
  const ret = []
  if (radix < 0) {
    radix *= -1
    finalArray.reverse()
  }
  for (let i = 0; i < finalArray.length; i += radix) {
    ret.push(finalArray.slice(i, i + radix))
  }
  return ret
}
const getRGB = color => {
  let final
  if (!/^#(?:[0-9a-f]{1,2}){3}$/i.test(color)) {
    final = '#ff0000'
  }
  final = color
  return (final.length === 4
    ? [...final.slice(1)].map(i => i.repeat(2))
    : groupBy([...final.slice(1)], 2).map(i => i.join(''))
  ).map(i => parseInt(i, 16) / 255)
}

export const rgb2str = (r, g, b) => `rgb(${r * 255}, ${g * 255}, ${b * 255})`
export const str2rgb = str => {
  if (/^#/.test(str)) return getRGB(str)
  return /^rgb\(\s*([\d]+(?:\.[\d]+)?)\s*,\s*([\d]+(?:\.[\d]+)?)\s*,\s*([\d]+(?:\.[\d]+)?)\s*\)$/
    .exec(str)
    .map(Number)
    .slice(1)
}

export const str2hex = str => rgb2hex(...str2rgb(str))

const getMinMax = color =>
  str2rgb(color)
    .map((_, i, arr) => (i < 2 ? arr.slice() : null))
    .slice(0, 2)
    .map((arr, i) => Math[['max', 'min'][i % 2]].apply(null, arr))

export const getColorLightness = color => {
  const [min, max] = getMinMax(color)
  return (min + max) / 2
}

export const rgb2hsl = color => {
  const [r, g, b] = str2rgb(color)
  const [min, max] = getMinMax(color)
  const l = getColorLightness(color)
  const s =
    min === max
      ? 0
      : l > 0.5
      ? (max - min) / (max + min)
      : (max - min) / (2.0 - max - min)

  const d = max - min
  const h =
    min === max
      ? 0
      : [(g - b) / d, 2.0 + (b - r) / d, 4.0 + (r - g) / d][
          [r, g, b].indexOf(max)
        ]

  return [h * 60, s, l]
}

const colorNtoHex = c => {
  return [c]
    .map(Math.round)
    .map(a => (a < 0 ? -a : a))
    .map(a => a.toString(16))
    .map(c => (c.charAt(0) === c.charAt(1) ? c.charAt(0) : c))
}

export const rgb2hex = (r, g, b) => '#' + [r, g, b].map(colorNtoHex).join('')

export const hsl2rgb = (h, s, l) =>
  s === 0
    ? [255, 255, 255].map(a => a * l).map(Math.round)
    : ((h, s, l) => {
        const t1 = l < 0.5 ? l * (1.0 + s) : l + s - l * s
        const t2 = 2.0 * l - t1
        const H = h / 360
        let [r, g, b] = [H + 1 / 3, H, H - 1 / 3]
        const tf = v =>
          v * 6 < 1
            ? t1 + (t1 - t2) * 6 * v
            : 2 * v < 1
            ? t1
            : 3 * v < 1
            ? t2 + (t1 - t2) * (2 / 3 - v) * 6
            : t2
        return [r, g, b]
          .map(tf)
          .map(i => i * 255)
          .map(Math.round)
      })(h, s, l)

export const getColorHue = color => rgb2hsl(color)[0]
export const hsl2hex = (h, s, l) => rgb2hex(...hsl2rgb(h, s, l))

export const darkenColor = (color, percent = 0.3) =>
  rgb2str(
    hsl2rgb(
      rgb2hsl(color).map((a, i) => {
        return i === 2 ? a - a * percent : a
      })
    )
  )
