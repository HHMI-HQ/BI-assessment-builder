import { env } from '@coko/server'
// const components = require('./components')

const components = [
  // models from coko server
  '@coko/server/dist/models/user',
  '@coko/server/dist/models/identity',
  '@coko/server/dist/models/team',
  '@coko/server/dist/models/teamMember',
  '@coko/server/dist/models/chatChannel',
  '@coko/server/dist/models/chatMessage',
  '@coko/server/dist/models/file',

  // local models
  './models/question',
  './models/questionVersion',
  './models/team',
  './models/user',
  './models/list',
  './models/listMember',
  './models/complexItemSet',
  './models/notification',
  './models/review',
  './models/archivedItem',
  './models/report',
  './models/resources',
  './models/courseMetadata',

  // local api
  './api', // graphql
  './rest',
]

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
  port: env('SERVER_PORT', { type: 'number' }) || 3000,
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
