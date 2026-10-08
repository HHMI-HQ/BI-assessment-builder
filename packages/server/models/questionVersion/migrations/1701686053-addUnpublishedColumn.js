const { logger } = require('@coko/server')

export const up = knex => {
  try {
    return knex.schema.table('question_versions', table => {
      table.boolean('unpublished').defaultTo(false).nullable()
    })
  } catch (e) {
    logger.error(
      'Question Version: migration adding unpublished field for table question_versions failed!',
    )
    throw new Error(e)
  }
}

export const down = knex =>
  knex.schema.table('question_versions', table => {
    table.dropColumn('unpublished')
  })
