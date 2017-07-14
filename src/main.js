import * as vega from 'vega-scale'
import {distanceLAB} from './colorDistance'

export default function analyze () {
  const stride = 0.1
  let scheme = vega.scheme('greys')
  let diff = []

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
    diff.push(distanceLAB(scheme[i], scheme[i + 1]))
  }

  return diff
}
