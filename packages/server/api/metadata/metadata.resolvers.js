const { metadataResolver } = require('../../controllers/question.controllers')

module.exports = {
  Query: {
    getMetadata: metadataResolver,
  },
}
