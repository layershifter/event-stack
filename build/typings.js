const fs = require('fs')
const path = require('path')
const { rollup } = require('rollup')

const plugins = require('./plugins')

const buildTypings = async () => {
  const inputConfig = {
    external: ['exenv', 'prop-types', 'react'],
    input: 'src/index.ts',
    plugins: plugins('typings'),
  }
  const outputConfig = {
    exports: 'named',
    file: `lib/event-stack.js`,
    format: 'es',
    name: 'EventStack',
  }

  const bundle = await rollup(inputConfig)

  await bundle.generate(outputConfig)
  await bundle.write(outputConfig)
}

buildTypings()
  .then(() => {
    fs.unlinkSync(path.resolve(__dirname, `../lib/event-stack.js`))
  })
  .catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
