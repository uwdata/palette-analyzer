import * as d3 from 'd3-color'
import {jab} from '../node_modules/d3-cam02/src/cam02.js'
import {norm2} from './math.js'

/**
 * Compute the color distance in RGB space.
 * https://en.wikipedia.org/wiki/Color_difference
 * @param c1 Color 1.
 * @param c2 Color 2.
 * @returns {Number} Euclidean distance between the two colors in RGB space.
 */
export function distanceRGB (c1, c2) {
  c1 = d3.color(c1)
  c2 = d3.color(c2)

  let p = [c1.r, c1.g, c1.b]
  let q = [c2.r, c2.g, c2.b]

  return norm2(p, q)
}

/**
 * Compute the perceptual distance between two colors, using the original CIELAB
 * DE76 formula, namely the Euclidean distance in CIELAB space.
 * @param c1 Color 1.
 * @param c2 Color 2.
 * @returns {Number} 3D Euclidean distance between c1 and c2 in CIELAB space
 */
export function distanceLAB (c1, c2) {
  c1 = d3.lab(d3.color(c1))
  c2 = d3.lab(d3.color(c2))

  let p = [c1.l, c1.a, c1.b]
  let q = [c2.l, c2.a, c2.b]

  return norm2(p, q)
}

/**
 * Compute the distances between two CIECAM02-UCS Jab colors.
 * Behind the hood it calculates an adjusted L2 norm in CIECAM02-UCS space.
 * https://github.com/connorgr/d3-cam02/blob/master/src/cam02.js#L391
 * @param c1 Color 1.
 * @param c2 Color 2.
 * @returns {Number} Color distance.
 */
export function distanceUCS (c1, c2) {
  c1 = jab(c1)
  c2 = jab(c2)

  return c1.de(c2)
}

/**
 * Compute the perceptual distance between two colors, using CIEDE2000.
 * @param c1 Color 1.
 * @param c2 Color 2.
 * @returns {Number} The perceptual distance between c1 and c2.
 */
export function distanceCIEDE2000 (c1, c2) {
  // TODO
}
