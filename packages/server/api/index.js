const merge = require('lodash/merge')

const question = require('./question')
const user = require('./user')

module.exports = {
  typeDefs: [question.typeDefs, user.typeDefs].join(' '),
  resolvers: merge({}, question.resolvers, user.resolvers),
}
