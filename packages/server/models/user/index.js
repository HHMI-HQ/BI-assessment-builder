const loaders = require('@coko/server/dist/models/user/user.loaders')

const model = require('./user.model')

module.exports = {
  model,
  modelName: 'User',
  modelLoaders: loaders,
}
