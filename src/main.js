import * as vega from 'vega-scale'
import {default as jet} from './jet'
import {
  distanceUCS,
  distanceRGB,
  distanceLAB,
  distanceName_,
  distanceLuminance,
  maxColorName,
  maxUCS,
  maxLAB,
  maxLuminance,
  maxRGB
} from './colorDistance'

function tuple_factory (palette, index, c1, c2, c1_name, c2_name) {
  return {
    create: function (space, value) {
      return {
        palette: palette,
        x: index,
        color_prev: c1,
        color: c2,
        name_prev: c1_name,
        name: c2_name,
        y: value,
        space: space
      }
    }
  }
}

function analyze (palette, stride, pivot) {
  stride = stride || 0.1
  let scheme = vega.scheme(palette)
  let diff = []

  // sanity check, and sneak jet in
  if (!scheme) {
    if (palette === 'jet') {
      scheme = jet
    } else {
      return diff
    }
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

  pivot = pivot != null ? Math.min(scheme.length - 1, pivot) : pivot

  for (let i = 0; i < scheme.length; i++) {
    let c1 = pivot != null ? scheme[pivot] : (i === 0 ? scheme[i] : scheme[i - 1])
    let c2 = scheme[i]
    let names = distanceName_(c1, c2)
    let factory = tuple_factory(palette, i, c1, c2, names.name1, names.name2)

    diff.push(factory.create('CIECAM02 UCS', distanceUCS(c1, c2) / maxUCS))
    diff.push(factory.create('RGB', distanceRGB(c1, c2) / maxRGB))
    diff.push(factory.create('CIELAB (DE76)', distanceLAB(c1, c2) / maxLAB))
    diff.push(factory.create('Luminance', distanceLuminance(c1, c2) / maxLuminance))
    diff.push(factory.create('Color Name', names.distance / maxColorName))
  }

  return diff
}

export {analyze}
