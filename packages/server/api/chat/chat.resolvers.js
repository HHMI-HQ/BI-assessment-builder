const { pubsubManager } = require('@coko/server')
const { withFilter } = require('graphql-subscriptions')

const {
  createChatThread,
  getMessages,
  getMessageAuthor,
  uploadAttachments,
  getAttachments,
  sendMessage,
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

const attachmentResolver = async message => {
  return getAttachments(message)
}

const sendMessageResolver = async (_, { input }, ctx) => {
  try {
    const { chatThreadId, content, userId, mentions } = input
    return sendMessage(chatThreadId, content, userId, mentions)
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  ChatThread: {
    messages: messagesResolver,
  },
  ChatMessage: {
    user: userResolver,
    attachments: attachmentResolver,
  },
  Mutation: {
    sendMessage: sendMessageResolver,
    createChatThread: createChatThreadResolver,
    uploadAttachments: uploadAttachmentsResolver,
  },
  Subscription: {
    messageCreated: {
      subscribe: async (...args) => {
        const pubsub = await pubsubManager.getPubsub()

        return withFilter(
          () => {
            return pubsub.asyncIterator('MESSAGE_CREATED')
          },
          (payload, variables) => {
            const { chatThreadId } = variables
            const { messageCreated } = payload
            return chatThreadId === messageCreated.id
          },
        )(...args)
      },
    },
  },
}
