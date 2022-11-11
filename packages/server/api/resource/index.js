const fs = require('fs')
const path = require('path')

const resourceResolvers = require('./resource.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'resource.graphql'), 'utf-8'),
  resolvers: resourceResolvers,
}
