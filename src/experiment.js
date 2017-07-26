import * as stat from 'vega-statistics'
import {spline} from '../lib/cubicSpline'

/**
 * Normalize the values to be within [0, 1].
 * @param {Array} data An array of *scala* value (i.e. y values only)
 * @return {Array}
 */
function normalize (data) {
  let min = Infinity
  let max = -Infinity

  data.forEach((s) => {
    min = Math.min(min, s)
    max = Math.max(max, s)
  })

  // normalize y to be within [0, 1]
  data = data.map((val) => (val - min) / (max - min))

  return data
}

/**
 * Format a scalar array into [{"x": index, "y": value}]
 * @param data
 * @returns {Array}
 */
function format (data) {
  data = data.map((val, idx) => {
    return {
      "x": idx,
      "y": val
    }
  })

  return data
}

/**
 * Clamp x to be within [0, 1]
 * @param x
 * @returns {number}
 */
function clamp (x) {
  return Math.min(1, Math.max(0, x))
}

/**
 * Create "continuous" data from gaussian mixtures.
 * @param modes The number of gaussian distributions.
 * @param steps Total number of samples.
 * @returns {Array} The data.
 */
function dataGaussian (modes, steps) {
  modes = modes || 4
  steps = steps || 500

  let dists = []

  // create normal distributions
  for (let i = 0; i < modes; i++) {
    let mean = Math.random() / modes + 1 / modes * i
    let sd = 0.3 / modes * (0.9 + Math.random() * 0.2)

    dists.push(stat.randomNormal(mean, sd))
  }

  // create a mixture of distributions
  let dist = stat.randomMixture(dists)

  // get the pdf at [steps] interval
  let result = []

  for (let i = 0; i < steps; i++) {
    let s = dist.pdf(1 / steps * i)
    result.push(s)
  }

  return format(normalize(result))
}

function dataSpline (steps) {
  steps = steps || 500

  const vy = 0.03
  const vx = 0.05
  const seed = Math.random()
  let comp = seed < vy ? seed + vy : seed - vy

  let xs = [0, 0.2, 0.5 - vx, 0.5, 0.5 + vx, 0.8, 1]
  let ys = [Math.random(), Math.random(), comp, seed, comp, Math.random(), Math.random()]
  let result = []

  for (let i = 0; i < steps; i++) {
    result.push(spline(1 / steps * i, xs, ys))
  }

  return format(normalize(result))
}

function dataPeaks (peaks, steps) {
  peaks = peaks || 4
  steps = steps || 500

  const vy = 0.05
  const seed = Math.random()
  let comp = seed - vy

  let xs = []
  let ys = []
  let result = []
  let s = 0.5 / peaks

  for (let i = 0; i < 2 * peaks + 1; i++) {
    xs.push(s * i)
    ys.push(i % 2 ? seed : comp)
  }

  for (let i = 0; i < steps; i++) {
    result.push(spline(1 / steps * i, xs, ys))
  }

  return format(result)
}

function dataMax (steps) {
  steps = steps || 500

  const vy = 0.05
  const vx = 0.1
  const seed = Math.random()
  const pos = 0.25 + Math.random() * 0.5
  let comp = seed - vy

  let xs = [0, pos - vx, pos, pos + vx, 1]
  let ys = [comp, comp, seed, comp, comp]
  let result = []

  for (let i = 0; i < steps; i++) {
    result.push(spline(1 / steps * i, xs, ys))
  }

  return format(result)
}

export {
  dataGaussian,
  dataSpline,
  dataPeaks,
  dataMax
}
