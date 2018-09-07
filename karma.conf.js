const plugins = require('./rollup.plugins')

module.exports = config => {
  config.set({
    coverageReporter: {
      reporters: [{ type: 'lcov', dir: 'coverage', subdir: '.' }],
      includeAllSources: true,
    },
    files: [{ pattern: 'src/**/*.spec.ts', type: 'js', watched: false }],
    frameworks: ['jasmine'],
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    preprocessors: {
      'src/**/*.ts': ['rollup'],
      'test/**/*.ts': ['rollup'],
    },
    rollupPreprocessor: {
      plugins: plugins(),
      output: {
        globals: {
          describe: 'describe',
          expect: 'expect',
          it: 'it',
        },
        file: 'test.js',
        format: 'iife',
        sourcemap: 'inline',
      },
    },
    reporters: ['spec', 'coverage'],
    singleRun: true,
  })
}
