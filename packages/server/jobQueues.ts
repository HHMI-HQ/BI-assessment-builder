import productionChatActivityNotification  from './services/chatActivityNotifications'
import emptyTempFolder from './services/emptyTemp'

export default [
    {
      name: 'notify-production-chat-activity',
      handler: productionChatActivityNotification,
      batchSize: 1,
      concurrency: 1,
      schedule: '0 8 * * *', // a valid cron pattern
      scheduleTimezone: 'America/New_York', // optional, what timezone should be followed
    },
    {
      name: 'empty-tmp-folder',
      handler: emptyTempFolder,
      schedule: '0 3 * * *', // a valid cron pattern
      scheduleTimezone: 'America/New_York', // optional, what timezone should be followed
    },
  ]