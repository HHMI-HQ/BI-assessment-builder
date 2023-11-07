const {
  getUserNotifications,
} = require('../../controllers/notification.controllers')

const userNotificationsResolver = async (_, args, ctx) => {
  return getUserNotifications(ctx.user, args)
}

module.exports = {
  Query: {
    userNotifications: userNotificationsResolver,
  },
}
