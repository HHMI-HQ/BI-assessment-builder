const { logger } = require('@coko/server')

export const up = knex => {
  try {
    return knex.schema.table('lists', table => {
      table.jsonb('customOrder').nullable()
    })
  } catch (e) {
    logger.error('List: add column customOrder failed!')
    throw new Error(e)
  }
}

export const down = knex =>
  knex.schema.table('lists', table => {
    table.dropColumn('customOrder')
  })
