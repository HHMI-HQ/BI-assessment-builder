/* eslint-disable import/no-extraneous-dependencies */

const { eslint } = require('@coko/lint')

eslint.settings = {
  'import/core-modules': ['ui'],
  jest: {
    version: '27',
  },
}

eslint.root = true

module.exports = eslint
