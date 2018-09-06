const path = require('path')

module.exports = mode =>
  [
    mode !== 'declarations' &&
      require('rollup-plugin-alias')({
        resolve: ['.ts'],
        lib: path.resolve('./src/lib'),
      }),
    require('rollup-plugin-commonjs')({
      include: /exenv/,
      extensions: ['.js'],
      namedExports: {
        'node_modules/exenv/index.js': ['canUseDOM'],
      },
    }),
    mode !== 'declarations' &&
      require('rollup-plugin-babel')({
        exclude: 'node_modules/**',
        extensions: ['.ts', '.js'],
      }),
    require('rollup-plugin-node-resolve')({
      extensions: ['.ts', '.js'],
      jsnext: true,
      main: true,
    }),
    mode === 'production' && require('rollup-plugin-terser'),
    mode === 'declarations' &&
      require('rollup-plugin-typescript2')({
        clean: true,
        useTsconfigDeclarationDir: true,
      }),
  ].filter(Boolean)
