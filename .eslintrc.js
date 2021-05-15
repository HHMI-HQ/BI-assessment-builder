const { eslint } = require('@coko/lint')

eslint.settings = {
  'import/core-modules': ['ui'],
}

module.exports = eslint
