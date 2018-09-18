const { rollup } = require('rollup')
const plugins = require('./plugins')

const mode = process.env.NODE_ENV

const buildEntry = async format => {
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

const bundle = async () => {
  await Promise.all([buildEntry('cjs'), buildEntry('es'), buildEntry('umd')])
}

bundle().catch(err => {
  console.error(err.stack)
  process.exit(1)
})
