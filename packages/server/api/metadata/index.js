const fs = require('fs')
const path = require('path')

const metadataResolvers = require('./metadata.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'metadata.graphql'), 'utf-8'),
  resolvers: metadataResolvers,
}
