const { logger } = require('@coko/server')

export const up = knex => {
  try {
    return knex.schema.alterTable('question_versions', table => {
      table.text('literatureAttribution').alter()
    })
  } catch (error) {
    logger.error(
      'Question Version: migration altering column `literatureAttribution` for table question_versions failed!',
    )
    throw new Error(error)
  }
}

export const down = knex =>
  knex.schema.table('question_versions', table => {
    table.string('literatureAttribution').alter()
  })
