const { logger } = require('@coko/server')

export const up = knex => {
  try {
    return knex.schema.createTable('subdiscipline_statement', table => {
      table.uuid('id').primary()
      table
        .timestamp('created', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now())
      table.timestamp('updated', { useTz: true })
      table.text('label').notNullable()
      table.text('value')
      table
        .uuid('subdiscipline_id')
        .notNullable()
        .references('id')
        .inTable('subdiscipline')
      table.boolean('enabled').defaultTo(true)
      table.smallint('order').defaultTo(0)
    })
  } catch (error) {
    logger.error('Resources: initial migration failed!')
    throw new Error(error)
  }
}

export const down = knex => knex.schema.dropTable('subdiscipline_statement')
