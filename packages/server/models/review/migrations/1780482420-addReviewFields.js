const { logger } = require('@coko/server')

export const up = knex => {
  try {
    return knex.schema.table('reviews', table => {
      table.jsonb('responses').defaultTo({})
    })
  } catch (error) {
    logger.error('Reviews: migration adding column `responses` failed!')
    throw new Error(error)
  }
}

export const down = knex =>
  knex.schema.table('reviews', table => {
    table.dropColumn('responses')
  })
