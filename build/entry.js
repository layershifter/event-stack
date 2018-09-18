const fs = require('fs')

const writeEntryCjs = () =>
  new Promise((resolve, reject) =>
    fs.writeFile(
      `./lib/cjs/index.js`,
      `
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./event-stack.production.js');
} else {
  module.exports = require('./event-stack.development.js');
}
`,
      err => {
        if (err) reject(err)
        else resolve()
      },
    ),
  )

const writeEntryEs = () =>
  new Promise((resolve, reject) =>
    fs.writeFile(
      `./lib/es/index.js`,
      `
import development from './event-stack.development.js';
import production from './event-stack.production.js';

const module = process.env.NODE_ENV === 'production' ? development : production;

export default module;
`,
      err => {
        if (err) reject(err)
        else resolve()
      },
    ),
  )

const entry = async () => {
  await Promise.all([writeEntryCjs(), writeEntryEs()])
}

entry().catch(err => {
  console.error(err.stack)
  process.exit(1)
})
