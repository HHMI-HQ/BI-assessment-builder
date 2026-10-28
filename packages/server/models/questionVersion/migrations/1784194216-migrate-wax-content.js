const { logger, useTransaction, uuid } = require('@coko/server')

// const extractDocumentText = data => {
//   let allContent = ''

//   const extract = obj => {
//     const { content } = obj
//     if (!Array.isArray(content)) return

//     content.forEach(item => {
//       const { text, content: itemContent } = item

//       if (text) allContent += `${text} `
//       if (itemContent) extract(item)
//     })
//   }

//   extract(data)
//   return allContent
// }

export const up = knex => {
  try {
    return useTransaction(async trx => {
      const questionVersions = await knex('question_versions').transacting(trx)

      await Promise.all(
        questionVersions.map(async qv => {
          const itemContent = structuredClone(qv.content)

          if (
            itemContent.content &&
            itemContent.content[0] &&
            itemContent.content[0].type === 'multiple_choice_container'
          ) {
            const options = itemContent.content[0].content.filter(
              c => c.type === 'multiple_choice',
            )

            options.forEach(opt => {
              const index = itemContent.content[0].content.findIndex(
                o => o.attrs.id === opt.attrs.id,
              )

              itemContent.content[0].content.splice(index + 1, 0, {
                type: 'feedback_prompt',
                attrs: {
                  class: 'feedback-prompt',
                  id: uuid(),
                },
                content: [
                  {
                    type: 'paragraph',
                    attrs: {
                      class: 'paragraph',
                    },
                    content: [
                      {
                        type: 'text',
                        text: opt.attrs.feedback,
                      },
                    ],
                  },
                ],
              })
            })

            await knex('question_versions')
              .transacting(trx)
              .where('id', qv.id)
              .update({
                content: itemContent,
              })
          }

          //   await knex('question_versions')
          //     .transacting(trx)
          //     .where('id', qv.id)
          //     .update({
          //       contentText: extractDocumentText(qv.content),
          //     })
        }),
      )
    })
  } catch (e) {
    logger.error('Question Version: ...!')
    throw new Error(e)
  }
}

export const down = knex => {}
