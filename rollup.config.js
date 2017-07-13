import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'index.js',
  format: 'umd',
  moduleName: 'palette_analyzer',
  plugins: [resolve()],
  dest: 'build/palette-analyzer.js'
}
