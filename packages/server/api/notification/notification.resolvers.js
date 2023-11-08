const {
  getUserNotifications,
  getUnreadNotificationsCountForUser,
  markNotifications,
} = require('../../controllers/notification.controllers')

const userNotificationsResolver = async (_, { type, options }, ctx) => {
  return getUserNotifications(ctx.user, type, options)
}

const getUnreadNotificationsCountResolver = async (_, __, ctx) => {
  return getUnreadNotificationsCountForUser(ctx.user)
}

const markAsResolver = async (_, { read, notificationIds }) => {
  return markNotifications(read, notificationIds)
}

module.exports = {
  Query: {
    userNotifications: userNotificationsResolver,
    getUnreadNotificationsCount: getUnreadNotificationsCountResolver,
  },
  Mutation: {
    markAs: markAsResolver,
  },
}
