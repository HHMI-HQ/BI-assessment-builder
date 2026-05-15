const { logger, useTransaction, uuid } = require('@coko/server')

const UNIT_LABEL = 'Science as a process'
const UNIT_VALUE = 'scienceAsAProcess'

exports.up = knex => {
  try {
    return useTransaction(async trx => {
      const introBioForMajorsCourse = await knex('course')
        .transacting(trx)
        .where('value', 'introBioForMajors')
        .first()

      return knex('unit').transacting(trx).insert({
        id: uuid(),
        created: knex.fn.now(),
        updated: knex.fn.now(),
        label: UNIT_LABEL,
        value: UNIT_VALUE,
        courseId: introBioForMajorsCourse.id,
        order: 7,
      })
    })
  } catch (error) {
    logger.error(
      'Course metadata:  migration adding "Science as a Process" unit failed!',
    )
    throw new Error(error)
  }
}

exports.down = knex => {
  try {
    return knex('unit').where('value', UNIT_VALUE).del()
  } catch (error) {
    throw new Error(error)
  }
}

// Science as a process
