const plugins = require('./rollup.plugins')

module.exports = config => {
  config.set({
    coverageReporter: {
      reporters: [{ type: 'lcov', dir: 'coverage', subdir: '.' }],
      includeAllSources: true,
    },
    files: [
      // use UMD builds
      { pattern: 'node_modules/prop-types/prop-types.js', type: 'js', watched: false },
      { pattern: 'node_modules/react/umd/react.development.js', type: 'js', watched: false },
      {
        pattern: 'node_modules/react-test-renderer/umd/react-test-renderer.development.js',
        type: 'js',
        watched: false,
      },

      { pattern: 'src/**/*.spec.ts', type: 'js', watched: false },
      { pattern: 'src/**/*.spec.tsx', type: 'js', watched: false },
    ],
    frameworks: ['jasmine'],
    mime: {
      'text/x-typescript': ['ts', 'tsx'],
    },
    preprocessors: {
      'src/**/*.{ts,tsx}': ['rollup'],
    },
    rollupPreprocessor: {
      external: ['prop-types', 'react', 'react-test-renderer'],
      plugins: plugins('test'),
      output: {
        globals: {
          describe: 'describe',
          expect: 'expect',
          it: 'it',
          'prop-types': 'PropTypes',
          react: 'React',
          'react-test-renderer': 'ReactTestRenderer',
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
