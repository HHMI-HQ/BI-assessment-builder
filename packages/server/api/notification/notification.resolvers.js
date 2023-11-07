const {
  getUserNotifications,
  markNotifications,
} = require('../../controllers/notification.controllers')

const userNotificationsResolver = async (_, { type, options }, ctx) => {
  return getUserNotifications(ctx.user, type, options)
}

const markAsResolver = async (_, { read, notificationIds }) => {
  return markNotifications(read, notificationIds)
}

module.exports = {
  Query: {
    userNotifications: userNotificationsResolver,
  },
  Mutation: {
    markAs: markAsResolver,
  },
}
