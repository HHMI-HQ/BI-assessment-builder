const { createChatThread } = require('../../controllers/chat.controllers')

const createChatThreadResolver = async (_, { input }) => {
  return createChatThread(input)
}

module.exports = {
  Mutation: {
    createChatThread: createChatThreadResolver,
  },
}
