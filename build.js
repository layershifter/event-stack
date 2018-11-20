const fs = require('fs')
const rimraf = require('rimraf')
const { rollup } = require('rollup')

const plugins = require('./rollup.plugins')

const buildEntry = async (format, mode) => {
  const inputConfig = {
    external: [format === 'cjs' && 'exenv', 'prop-types', 'react'],
    input: 'src/index.ts',
    plugins: plugins(mode),
  }
  const outputConfig = {
    exports: 'named',
    file: `lib/${format}/event-stack.${mode}.js`,
    format,
    globals: format === 'umd' && {
      'prop-types': 'PropTypes',
      react: 'React',
    },
    name: 'EventStack',
  }

  const bundle = await rollup(inputConfig)

  await bundle.generate(outputConfig)
  await bundle.write(outputConfig)
}

const removeFiles = glob =>
  new Promise((resolve, reject) =>
    rimraf(glob, err => {
      if (err) reject(err)
      else resolve()
    }),
  )

const writeEntry = () =>
  new Promise((resolve, reject) =>
    fs.writeFile(
      './lib/index.js',
      `
'use strict';

var stack;

if (process.env.NODE_ENV === 'production') {
  stack = require('./cjs/event-stack.production.js');
} else {
  stack = require('./cjs/event-stack.development.js');
}

module.exports = stack.default;
module.exports.instance = stack.instance;
`,
      err => {
        if (err) reject(err)
        else resolve()
      },
    ),
  )

const build = async () => {
  await removeFiles('./lib')

  await Promise.all([
    buildEntry('cjs', 'development'),
    buildEntry('cjs', 'production'),
    buildEntry('umd', 'development'),
    buildEntry('umd', 'production'),
    buildEntry('es', 'declarations'),
  ])

  await Promise.all([
    removeFiles('./lib/es'),
    removeFiles('./lib/types/**/*.spec.d.ts'),
    writeEntry(),
  ])
}

build().catch(err => {
  console.error(err.stack)
  process.exit(1)
})
