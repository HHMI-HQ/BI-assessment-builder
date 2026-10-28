const { env } = require('@coko/server')
const components = require('./components')

export default {
  components,
  db: {},
  subscriptionsDb: {},
  // emailVerificationTokenExpiry: {
  //   amount: 24,
  //   unit: 'hours',
  // },
  // passwordResetTokenExpiry: {
  //   amount: 24,
  //   unit: 'hours',
  // },
  // pool: { min: 0, max: 20, idleTimeoutMillis: 1000 },
  port: 3000,
  // useFileStorage: true,
  useGraphQLServer: true,
  adminUser: false,
  mailer: {
    from: env('MAILER_SENDER'),
    transport: {
      host: env('MAILER_HOSTNAME'),
      port: env('MAILER_PORT', { type: 'number' }),
      auth: {
        user: env('MAILER_USER'),
        pass: env('MAILER_PASSWORD'),
      },
    },
  },
  sentry: false,
  serverUrl: 'localhost:3000',
  // protocol: 'http',
  // externalServerURL: undefined,
  teams: {
    global: [
      {
        displayName: 'Managing Editor',
        role: 'editor',
      },
      {
        displayName: 'Handling Editor',
        role: 'handlingEditor',
      },
      {
        displayName: 'Reviewer',
        role: 'reviewer',
      },
      {
        displayName: 'Production',
        role: 'production',
      },
      // {
      //   displayName: "Admin",
      //   role: "admin",
      // },
    ],
    nonGlobal: [
      {
        displayName: 'Managing Editor',
        role: 'editor',
      },
      {
        displayName: 'Handling Editor',
        role: 'handlingEditor',
      },
      {
        displayName: 'Author',
        role: 'author',
      },
      {
        displayName: 'Reviewer',
        role: 'reviewer',
      },
    ],
  },
  // schema: {},
  // validations: path.join(__dirname, 'modules', 'validations'),
}
