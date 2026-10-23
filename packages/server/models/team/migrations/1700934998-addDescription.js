const { logger } = require('@coko/server')

export const up = knex => {
  try {
    return knex.schema.table('team_members', table => {
      table.text('description').nullable()
    })
  } catch (e) {
    logger.error('TeamMember: add column description failed!')
    throw new Error(e)
  }
}

export const down = knex =>
  knex.schema.table('team_members', table => {
    table.dropColumn('description')
  })
