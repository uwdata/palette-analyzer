import * as stat from 'vega-statistics'

function generateData (modes, steps) {
  modes = modes || 2
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
  let min = Infinity
  let max = -Infinity
  for (let i = 0; i < steps; i++) {
    let s = dist.pdf(1 / steps * i)

    min = Math.min(min, s)
    max = Math.max(max, s)
    result.push(s)
  }

  // normalize y to be within [0, 1]
  result = result.map((val, idx) => {
    return {
      "x": idx,
      "y": (val - min) / (max - min)
    }
  })

  return result
}

export {generateData}
