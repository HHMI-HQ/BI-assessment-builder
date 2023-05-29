const { logger, useTransaction } = require('@coko/server')

const { ChatThread } = require('@coko/server/src/models')

const BASE_MESSAGE = '[CHAT CONTROLLER]'

const createChatThread = async (input = {}, options = {}) => {
  const { relatedObjectId, chatType } = input
  const CONTROLLER_MESSAGE = `${BASE_MESSAGE} createChatThread:`
  logger.info(
    `${CONTROLLER_MESSAGE} Create chat thread for question ${relatedObjectId}`,
  )

  try {
    return useTransaction(
      async tr => {
        return ChatThread.insert({ relatedObjectId, chatType }, { trx: tr })
      },
      { trx: options.trx, passedTrxOnly: true },
    )
  } catch (error) {
    logger.error(`${CONTROLLER_MESSAGE} signUp: ${error.message}`)
    throw new Error(error)
  }
}

module.exports = {
  createChatThread,
}
