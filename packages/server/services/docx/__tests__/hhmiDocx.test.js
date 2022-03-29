const { lorem } = require('faker')
const range = require('lodash/range')

const { uuid } = require('@coko/server')

const HHMIWaxToDocxConverter = require('../hhmiDocx.service')
const { getTestFilePath } = require('./_helpers')

const document = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: `Main description. ${lorem.sentences(15)}`,
        },
      ],
    },
    {
      type: 'multiple_choice_container',
      attrs: {
        id: uuid(),
      },
      content: [
        {
          type: 'question_node_multiple',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `The question. ${lorem.sentences(5)}`,
                },
              ],
            },
          ],
        },
        {
          type: 'multiple_choice',
          attrs: {
            feedback: `Feedback for one. ${lorem.sentences(3)}`,
            correct: false,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Option one. ${lorem.sentences(3)}`,
                },
              ],
            },
          ],
        },
        {
          type: 'multiple_choice',
          attrs: {
            feedback: `Feedback for two. ${lorem.sentences(3)}`,
            correct: true,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Option two. ${lorem.sentences(3)}`,
                },
              ],
            },
          ],
        },
        {
          type: 'multiple_choice',
          attrs: {
            feedback: `Feedback for three. ${lorem.sentences(3)}`,
            correct: true,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Option three. ${lorem.sentences(3)}`,
                },
              ],
            },
          ],
        },
        {
          type: 'multiple_choice',
          attrs: {
            feedback: `Feedback for four. ${lorem.sentences(3)}`,
            correct: false,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Option four. ${lorem.sentences(3)}`,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'multiple_choice_container',
      attrs: {
        id: uuid(),
      },
      content: [
        {
          type: 'question_node_multiple',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `The question. ${lorem.sentences(5)}`,
                },
              ],
            },
          ],
        },
        {
          type: 'multiple_choice',
          attrs: {
            feedback: `Feedback for one. ${lorem.sentences(3)}`,
            correct: false,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Option one. ${lorem.sentences(3)}`,
                },
              ],
            },
          ],
        },
        {
          type: 'multiple_choice',
          attrs: {
            feedback: `Feedback for two. ${lorem.sentences(3)}`,
            correct: true,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Option two. ${lorem.sentences(3)}`,
                },
              ],
            },
          ],
        },
        {
          type: 'multiple_choice',
          attrs: {
            feedback: `Feedback for three. ${lorem.sentences(3)}`,
            correct: true,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Option three. ${lorem.sentences(3)}`,
                },
              ],
            },
          ],
        },
        {
          type: 'multiple_choice',
          attrs: {
            feedback: `Feedback for four. ${lorem.sentences(3)}`,
            correct: false,
          },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: `Option four. ${lorem.sentences(3)}`,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'fill_the_gap_container',
      attrs: {
        feedback: lorem.sentences(4),
        id: uuid(),
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: lorem.sentences(3),
            },
            {
              type: 'fill_the_gap',
              attrs: {
                answer: 'solution 1a; solution 1b',
                id: uuid(),
              },
            },
            {
              type: 'text',
              text: lorem.words(13),
            },
            {
              type: 'fill_the_gap',
              attrs: {
                answer: 'solution 2a;solution 2b',
                id: uuid(),
              },
            },
            {
              type: 'text',
              text: `${lorem.words(13)}.`,
            },
          ],
        },
      ],
    },
    // {
    //   type: 'fill_the_gap_container',
    //   attrs: {
    //     feedback: lorem.sentences(4),
    //     id: uuid(),
    //   },
    //   content: [
    //     {
    //       type: 'paragraph',
    //       content: [
    //         {
    //           type: 'text',
    //           text: lorem.sentences(3),
    //         },
    //         {
    //           type: 'fill_the_gap',
    //           attrs: {
    //             answer: 'solution 1a; solution 1b',
    //             id: uuid(),
    //           },
    //         },
    //         {
    //           type: 'text',
    //           text: lorem.words(13),
    //         },
    //         {
    //           type: 'fill_the_gap',
    //           attrs: {
    //             answer: 'solution 2a;solution 2b',
    //             id: uuid(),
    //           },
    //         },
    //         {
    //           type: 'text',
    //           text: `${lorem.words(13)}.`,
    //         },
    //       ],
    //     },
    //   ],
    // },
  ],
}

const metadata = {
  'Topic Data': [
    {
      Topic: lorem.words(4),
      Subtopic: lorem.words(4),
      Framework: lorem.words(4),
      'Framework Unit': lorem.words(4),
      'Framework Topic': lorem.words(4),
      'Framework Learning Objective': lorem.words(4),
      'Framework Essential Knowledge': lorem.words(4),
    },
    {
      Topic: lorem.words(4),
      Subtopic: lorem.words(4),
      Framework: lorem.words(4),
      'Framework Unit': lorem.words(4),
      'Framework Topic': lorem.words(4),
      'Framework Learning Objective': lorem.words(4),
      'Framework Essential Knowledge': lorem.words(4),
    },
  ],
  Keywords: range(3).map(i => lorem.word()),
  'Biointeractive Resources': lorem.words(4),
  'Cognitive Level': lorem.words(4),
  'Affective Level': lorem.words(4),
  'Psychomotor Level': lorem.words(4),
  'Reading Level': lorem.words(4),
}

describe('HHMI docx service', () => {
  test('HHMI document', () => {
    const filepath = getTestFilePath('multiple_choice.docx')

    const converter = new HHMIWaxToDocxConverter(document, {}, metadata, {
      showFeedback: true,
      showMetadata: true,
    })

    converter.writeToPath(filepath)
    expect(true).toBe(true)
  })
})
