const { logger } = require('@coko/server')

exports.up = knex => {
  try {
    return knex.schema.table('question_versions', table => {
      table.text('contentText').nullable()
    })
  } catch (e) {
    logger.error('Question Version: add column contentText failed!')
    throw new Error(e)
  }
}

exports.down = knex =>
  knex.schema.table('question_versions', table => {
    table.dropColumn('contentText')
  })
