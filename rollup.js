const fs = require('fs')
const rimraf = require('rimraf')
const { rollup } = require('rollup')

const plugins = require('./rollup.plugins')

const build = async (format, mode) => {
  const inputConfig = {
    input: 'src/index.ts',
    plugins: plugins(mode),
  }
  const outputConfig = {
    file: `lib/${format}/event-stack.${mode}.js`,
    format,
    name: 'EventStack',
  }

  const bundle = await rollup(inputConfig)

  await bundle.generate(outputConfig)
  await bundle.write(outputConfig)
}

rimraf.sync('./lib')

Promise.all([
  build('cjs', 'development'),
  build('cjs', 'production'),
  build('umd', 'development'),
  build('umd', 'production'),
  build('es', 'declarations'),
]).then(() => {
  fs.writeFileSync(
    './lib/index.js',
    `
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/event-stack.production.js');
} else {
  module.exports = require('./cjs/event-stack.development.js');
}
`,
  )

  rimraf.sync('./lib/es')
  rimraf.sync('./lib/types/**/*.spec.d.ts')
})
