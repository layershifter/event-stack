module.exports = mode =>
  [
    require('rollup-plugin-commonjs')({
      include: ['node_modules/exenv/**'].filter(Boolean),
      extensions: ['.js'],
      namedExports: {
        'node_modules/exenv/index.js': ['canUseDOM'],
      },
    }),
    mode !== 'typings' &&
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
    mode === 'typings' &&
      require('rollup-plugin-typescript2')({
        clean: true,
        tsconfig: 'build/tsconfig.json',
        useTsconfigDeclarationDir: true,
      }),
  ].filter(Boolean)
