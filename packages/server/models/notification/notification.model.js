const {
  BaseModel,
  modelTypes: { id, boolean, object, string },
} = require('@coko/server')

const { applyListQueryOptions } = require('../helpers')

class Notification extends BaseModel {
  static get tableName() {
    return 'notifications'
  }

  constructor(properties) {
    super(properties)
    this.type = 'notification'
  }

  static get schema() {
    return {
      properties: {
        notification_type: string,
        user_id: id,
        object_id: id,
        content: object,
        read: boolean,
      },
    }
  }

  static async filterUserNotifications(
    userId,
    notificationsType,
    options = {},
  ) {
    try {
      const { read } = options

      const query = Notification.query(options.trx).where({
        userId,
        notificationsType,
        read,
      })

      return applyListQueryOptions(query, options)
    } catch (e) {
      console.error('Notification model: filter failed', e)
      throw new Error(e)
    }
  }

  static async markAs(data, options) {
    const { notificationIds, read } = data

    try {
      await Notification.query(options.trx)
        .patch({ read })
        .whereIn('id', notificationIds)
    } catch (e) {
      console.error(
        `Notification model: failed to mark notifications as ${
          read && 'un'
        }read`,
        e,
      )
      throw new Error(e)
    }
  }
}

module.exports = Notification
