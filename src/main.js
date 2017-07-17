import * as vega from 'vega-scale'
import {
  distanceUCS,
  distanceRGB,
  distanceLAB,
  distanceNameCosine
} from './colorDistance'

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
    let tuple = {
      palette: palette,
      x: i,
      ucs: distanceUCS(scheme[i], scheme[i + 1]),
      rgb: distanceRGB(scheme[i], scheme[i + 1]),
      lab: distanceLAB(scheme[i], scheme[i + 1]),
      color_name: distanceNameCosine(scheme[i], scheme[i + 1]) * 50
    }
    diff.push(tuple)
  }

  return diff
}

export {analyze}
