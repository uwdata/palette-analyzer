import * as d3 from 'd3-color'
import {norm2} from './math.js'

/**
 * Compute the distance between two colors in LAB space
 * @param c1 Color 1.
 * @param c2 Color 2.
 * @returns {Number} 3D Euclidean distance between c1 and c2 in LAB space
 */
export function distanceLAB(c1, c2) {
  c1 = d3.lab(d3.color(c1))
  c2 = d3.lab(d3.color(c2))

  let p = [c1.l, c1.a, c1.b]
  let q = [c2.l, c2.a, c2.b]

  return norm2(p, q)
}
