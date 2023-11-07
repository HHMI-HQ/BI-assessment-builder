const { logger } = require('@coko/server')

const { Notification } = require('../models')
const { labels } = require('./constants')

const BASE_MESSAGE = `${labels.NOTIFICATION_CONTROLLERS}:`

const getUserNotifications = async (userId, notificationType, options) => {
  const CONTROLLER_MESSAGE = `${BASE_MESSAGE} getUserNotifications:`

  try {
    return Notification.filterUserNotifications(
      userId,
      notificationType,
      options,
    )
  } catch (e) {
    logger.error(`${CONTROLLER_MESSAGE} ${e.message}`)
    throw new Error(e)
  }
}

const markNotifications = async (read, notificationIds, options) => {
  const CONTROLLER_MESSAGE = `${BASE_MESSAGE} markNotifications:`

  try {
    return Notification.markAs(
      {
        read,
        notificationIds,
      },
      options,
    )
  } catch (e) {
    logger.error(`${CONTROLLER_MESSAGE} ${e.message}`)
    throw new Error(e)
  }
}

module.exports = {
  getUserNotifications,
  markNotifications,
}
