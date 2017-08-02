import * as d3 from 'd3-color'
import {jab} from '../node_modules/d3-cam02/src/cam02.js'
import {norm2} from './math.js'
import {default as c3} from '../lib/c3'

export const maxRGB = 442 // sqrt(255 * 255 * 3)
export const maxLAB = 235 // this is questionable
export const maxUCS = 173 // this is questionable
export const maxColorName = 1 // by definition
export const maxLuminance = 100 // L* is within [0, 1]

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
 * Compute the distance in LAB Luminance channel.
 * @param c1
 * @param c2
 * @returns {number}
 */
export function distanceLuminance (c1, c2) {
  c1 = d3.lab(d3.color(c1))
  c2 = d3.lab(d3.color(c2))

  return Math.abs(c1.l - c2.l)
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

/**
 * A helper function to convert a color to its index in C3 color dictionary.
 * @param color
 * @returns {Number}
 */
function c3_index (color) {
  let x = d3.lab(color)
  let l = 5 * Math.round(x.l/5)
  let a = 5 * Math.round(x.a/5)
  let b = 5 * Math.round(x.b/5)
  let lookup = [l, a, b].join(",")
  return c3.map[lookup]
}

/**
 * A helper function to get the most frequent name associated with a color.
 * @param color_index
 * @returns {string}
 */
function getColorName (color_index) {
  let terms = c3.color.relatedTerms(color_index, 1)
  return terms[0] ? c3.terms[terms[0].index] : 'unknown'
}

/**
 * Compute the difference in their names between two colors. The distance
 * is measured as cosine of the angle between two naming frequency vector.
 * @param c1
 * @param c2
 * @returns {{name1: string, name2: string, distance: number}}
 */
export function distanceNameCosine (c1, c2) {
  // ask c3 to load data if this is never done before
  // note that it loads synchronously
  if (!c3.color) {
    c3.load('../lib/c3_data.json')

    // build lookup table
    c3.map = {}
    for (let c = 0; c < c3.color.length; ++c) {
      let x = c3.color[c];
      c3.map[[x.l, x.a, x.b].join(",")] = c;
    }
  }

  // find the index of the two colors
  let i1 = c3_index(c1)
  let i2 = c3_index(c2)

  // compute the cosine difference
  return {
    name1: getColorName(i1),
    name2: getColorName(i2),
    distance: 1 - c3.color.cosine(i1, i2)
  }
}
