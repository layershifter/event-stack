module.exports = mode =>
  [
    require('rollup-plugin-commonjs')({
      include: ['node_modules/exenv/**'].filter(Boolean),
      extensions: ['.js'],
      namedExports: {
        'node_modules/exenv/index.js': ['canUseDOM'],
      },
    }),
    mode !== 'declarations' &&
      require('rollup-plugin-babel')({
        exclude: 'node_modules/**',
        extensions: ['.ts', '.tsx', '.js'],
      }),
    require('rollup-plugin-node-resolve')({
      extensions: ['.ts', '.tsx', '.js'],
      browser: true,
      jsnext: true,
      main: true,
    }),
    require('rollup-plugin-replace')({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
    mode === 'production' && require('rollup-plugin-terser').terser(),
    mode === 'declarations' &&
      require('rollup-plugin-typescript2')({
        clean: true,
        useTsconfigDeclarationDir: true,
      }),
  ].filter(Boolean)
