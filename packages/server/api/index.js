const merge = require('lodash/merge')

const question = require('./question')
const user = require('./user')
const team = require('./team')
const metadata = require('./metadata')
const resource = require('./resource')

module.exports = {
  typeDefs: [
    question.typeDefs,
    user.typeDefs,
    team.typeDefs,
    metadata.typeDefs,
    resource.typeDefs,
  ].join(' '),
  resolvers: merge(
    {},
    question.resolvers,
    user.resolvers,
    team.resolvers,
    metadata.resolvers,
    resource.resolvers,
  ),
}
