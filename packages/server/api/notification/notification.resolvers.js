const {
  getUserNotifications,
} = require('../../controllers/notification.controllers')

const userNotificationsResolver = async (_, { type, options }, ctx) => {
  return getUserNotifications(ctx.user, type, options)
}

module.exports = {
  Query: {
    userNotifications: userNotificationsResolver,
  },
}
