/**
 * @fileoverview An implementation of the jet palette in MatLab.
 * References:
 * https://octave.sourceforge.io/octave/function/jet.html
 * https://bugs.launchpad.net/inkscape/+bug/236508
 */

import * as d3 from 'd3-color'

const stops = [
  "#00007F",
  "#0000FF",
  "#007FFF",
  "#00FFFF",
  "#7FFF7F",
  "#FFFF00",
  "#FF7F00",
  "#FF0000",
  "#7F0000"
]

/**
 * For simplicity, we just handle interpolation from 0 to 1
 * @type {number}
 */
const MIN = 0
const MAX = 1

/**
 * Linear interpolation between two numbers.
 * @param v1
 * @param v2
 * @param percent
 * @returns {Number}
 */
function linear (v1, v2, percent) {
  return v1 + (v2 - v1) * percent
}

/**
 * Linear interpolation between two colors
 * @param c1
 * @param c2
 * @param percent
 * @returns {string} For example rgb(0, 0, 0)
 */
function ramp (c1, c2, percent) {
  c1 = d3.color(c1)
  c2 = d3.color(c2)

  let c = d3.color(c1)
  c.r = linear(c1.r, c2.r, percent)
  c.g = linear(c1.g, c2.g, percent)
  c.b = linear(c1.b, c2.b, percent)

  return c.toString()
}

/**
 * Given a number within [0, 1], return the color in jet palette matching it.
 * @param val
 * @returns {string}
 */
export default function interpolate (val) {
  // clamp the value to be within [0, 1] range
  val = Math.max(MIN, Math.min(val, MAX))

  // depending on which interval the value falls in, the resulting color is a
  // linear ramp between the two end points
  for (let i = 0; i < stops.length - 1; i++) {
    const step = (MAX - MIN) / (stops.length - 1)

    let start = MIN + step * i
    let stop = MIN + step * (i + 1)

    if (val >= start && val <= stop) {
      return ramp(stops[i], stops[i + 1], (val - start) / step)
    }
  }
}