import * as vega from 'vega-scale'
import {
  distanceUCS,
  distanceRGB,
  distanceLAB,
  distanceNameCosine
} from './colorDistance'

function tuple_factory (palette, index, c1, c2) {
  return {
    create: function (space, value) {
      return {
        palette: palette,
        x: index,
        color_prev: c1,
        color: c2,
        y: value,
        space: space
      }
    }
  }
}

function analyze (palette, stride) {
  stride = stride || 0.1
  let scheme = vega.scheme(palette)
  let diff = []

  // sanity check
  if (!scheme) {
    return diff
  }

  // vega.scheme returns an array for categorical color scale and a function
  // for continuous scale; so here we are converting everything to an array
  if (typeof scheme === 'function') {
    let temp = []
    for (let i = 0; i <= 1; i += stride) {
      temp.push(scheme(i))
    }
    scheme = temp
  }

  for (let i = 0; i < scheme.length - 1; i++) {
    let c1 = scheme[i]
    let c2 = scheme[i + 1]
    let factory = tuple_factory(palette, i, c1, c2)

    diff.push(factory.create('Uniform Color Scheme', distanceUCS(c1, c2)))
    diff.push(factory.create('RGB', distanceRGB(c1, c2)))
    diff.push(factory.create('CIELAB (DE76)', distanceLAB(c1, c2)))
    diff.push(factory.create('Color Name', distanceNameCosine(c1, c2) * 50))
  }

  return diff
}

export {analyze}
