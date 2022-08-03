const { logger } = require('@coko/server')

exports.up = knex => {
  try {
    return knex.schema.createTable('question_versions', table => {
      table.uuid('id').primary()
      table
        .timestamp('created', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now())
      table.timestamp('updated', { useTz: true })

      table
        .uuid('question_id')
        .notNullable()
        .references('id')
        .inTable('questions')

      table.jsonb('content').nullable()

      table.boolean('submitted').defaultTo(false).notNullable()
      table.boolean('underReview').defaultTo(false).notNullable()
      table.boolean('published').defaultTo(false).notNullable()

      table.timestamp('publicationDate', { useTz: true })

      table.jsonb('topics')
      table.jsonb('courses')

      table.jsonb('keywords')
      table.jsonb('biointeractiveResources')

      table.text('cognitiveLevel').nullable()
      table.text('affectiveLevel').nullable()
      table.text('psychomotorLevel').nullable()
      table.text('readingLevel').nullable()

      table.text('type')
    })
  } catch (e) {
    logger.error('Question Version: initial migration failed!')
    throw new Error(e)
  }
}

exports.down = knex => knex.schema.dropTable('question_versions')
