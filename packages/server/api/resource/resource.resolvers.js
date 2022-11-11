const { resourceResolver } = require('../../controllers/question.controllers')

module.exports = {
  Query: {
    getResources: resourceResolver,
  },
}
