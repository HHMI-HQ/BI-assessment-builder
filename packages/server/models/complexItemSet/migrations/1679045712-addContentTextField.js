const { logger } = require('@coko/server')

export const up = knex => {
  try {
    return knex.schema.table('complexItemSets', table => {
      table.text('contentText').nullable()
    })
  } catch (e) {
    logger.error('Context-Dependent Item Set: add column contentText failed!')
    throw new Error(e)
  }
}

export const down = knex =>
  knex.schema.table('complexItemSets', table => {
    table.dropColumn('contentText')
  })
