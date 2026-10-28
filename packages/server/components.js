module.exports = [
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
