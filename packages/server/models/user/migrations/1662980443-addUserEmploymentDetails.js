const { logger } = require('@coko/server')

exports.up = knex => {
  try {
    return knex.schema.table('users', table => {
      table.boolean('ap_ib_courses').nullable()
      table.string('employment_status').nullable()
      table.string('other_level').nullable()
    })
  } catch (e) {
    logger.error(
      'Users: migration adding extra employment details fields for table users failed!',
    )
    throw new Error(e)
  }
}

exports.down = knex =>
  knex.schema.table('users', table => {
    table.dropColumn('ap_ib_courses')
    table.dropColumn('employment_status')
    table.dropColumn('other_level')
  })
