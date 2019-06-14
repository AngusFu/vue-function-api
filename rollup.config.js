export default {
  input: './src/index.js',
  output: [
    {
      format: 'esm',
      file: 'dist/index.mjs'
    },
    {
      name: 'VueFunctionalAPI',
      format: 'cjs',
      file: 'dist/index.cjs.js',
      exports: 'named'
    }
  ],
  plugins: [require('rollup-plugin-buble')()],
  external: ['vue']
}
