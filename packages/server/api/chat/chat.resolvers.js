const {
  createChatThread,
  getMessages,
  getMessageAuthor,
  uploadAttachments,
} = require('../../controllers/chat.controllers')

const createChatThreadResolver = async (_, { input }) => {
  return createChatThread(input)
}

const messagesResolver = async thread => {
  return getMessages(thread.id)
}

const userResolver = async message => {
  return getMessageAuthor(message)
}

const uploadAttachmentsResolver = async (_, { input }) => {
  return uploadAttachments(input)
}

module.exports = {
  ChatThread: {
    messages: messagesResolver,
  },
  ChatMessage: {
    user: userResolver,
  },
  Mutation: {
    createChatThread: createChatThreadResolver,
    uploadAttachments: uploadAttachmentsResolver,
  },
}
