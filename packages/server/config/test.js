/**
 * Only used by jest, not part of the distributed package
 */
const { deferConfig } = require('config/defer')

const components = require('./components')

module.exports = {
  'pubsweet-server': {
    baseUrl: deferConfig(cfg => {
      const { protocol, host, port } = cfg['pubsweet-server']
      return `${protocol}://${host}${port ? `:${port}` : ''}`
    }),
    db: {
      host: 'localhost',
      port: '5432',
      database: 'hhmi_test',
      user: 'hhmi_dev_user',
      password: 'hhmi_dev_user_password',
    },
    emailVerificationTokenExpiry: {
      amount: 24,
      unit: 'hours',
    },
    secret: 'whatASecret',
    passwordResetTokenExpiry: {
      amount: 24,
      unit: 'hours',
    },
  },
  pubsweet: {
    components,
  },
  teams: {
    global: {
      editor: {
        displayName: 'Editor',
        role: 'editor',
      },
      reviewer: {
        displayName: 'Reviewer',
        role: 'reviewer',
      },
      admin: {
        displayName: 'Admin',
        role: 'admin',
      },
    },
    nonGlobal: {
      editor: {
        displayName: 'Editor',
        role: 'editor',
      },
      author: {
        displayName: 'Author',
        role: 'author',
      },
      reviewer: {
        displayName: 'Reviewer',
        role: 'reviewer',
      },
    },
  },
}
