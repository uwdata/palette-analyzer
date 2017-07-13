import * as vs from 'vega-scale'

export default function analyze () {
  let scale_linear = vs.scale('linear')()
  return scale_linear.type
}
