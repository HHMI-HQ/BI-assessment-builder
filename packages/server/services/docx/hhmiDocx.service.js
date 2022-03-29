const {
  AlignmentType,
  Document,
  LevelFormat,
  Paragraph,
  TextRun,

  convertMillimetersToTwip,
} = require('docx')

const WaxToDocxConverter = require('./docx.service')

/**
 * TO DO
 *
 * match
 * essay
 */

class HHMIWaxToDocxConverter extends WaxToDocxConverter {
  constructor(doc, imageData, metadata, options = {}) {
    super(doc, imageData, options)
    this.metadata = metadata

    const newHandlers = {
      multiple_choice_container: this.multipleChoiceHandler,
      question_node_multiple: this.multipleChoiceQuestionHandler,
      multiple_choice: this.multipleChoiceOptionHandler,
      fill_the_gap_container: this.fillTheGapContainerHandler,
      fill_the_gap: this.fillTheGapHandler,
    }

    this.typeToHandlerMap = {
      ...this.typeToHandlerMap,
      ...newHandlers,
    }

    this.listTypes = {
      ...this.listTypes,
      MULTIPLE_CHOICE: 'multiple_choice',
    }

    this.config.numbering.config.push({
      levels: [
        {
          level: 0,
          format: LevelFormat.UPPER_LETTER,
          text: '%1.',
          alignment: AlignmentType.START,
          style: {
            paragraph: {
              indent: {
                left: convertMillimetersToTwip(7),
                hanging: this.listIndentFirstLevelHanging,
              },
              spacing: {
                before: 200,
                after: 200,
              },
            },
          },
        },
      ],
      reference: this.listTypes.MULTIPLE_CHOICE,
    })

    this.appendixHeaderStyles = {
      bold: true,
      size: this.baseFontSize + 4,
    }

    this.showFeedback = options.showFeedback || false
    this.showMetadata = options.showMetadata || false
    this.multipleChoiceSolutions = {}
    this.fillTheGapSolutions = {}
    this.fillTheGapFeedback = {}
  }

  multipleChoiceHandler = multipleChoice => {
    const groupId = multipleChoice.attrs.id
    this.listInstance += 1
    this.multipleChoiceSolutions[groupId] = []

    return [
      new Paragraph({
        children: [],
      }),
      ...this.contentParser(multipleChoice.content, {
        multipleChoiceGroupId: groupId,
        instance: this.listInstance,
        listType: this.listTypes.MULTIPLE_CHOICE,
        level: 0,
      }),
    ]
  }

  multipleChoiceQuestionHandler = question => {
    const parsed = this.contentParser(question.content)

    // const label = new Paragraph({
    //   children: [
    //     new TextRun({
    //       text: 'Question:',
    //       bold: true,
    //       size: this.baseFontSize + 2,
    //     }),
    //   ],
    // })

    // const output = [label, ...parsed]
    // return output

    return parsed
  }

  fillTheGapContainerHandler = container => {
    const groupId = container.attrs.id
    this.fillTheGapSolutions[groupId] = []
    this.fillTheGapFeedback[groupId] = container.attrs.feedback

    return [
      new Paragraph({ children: [] }),
      ...this.contentParser(container.content, { fillTheGapGroupId: groupId }),
    ]
  }

  fillTheGapHandler = (gap, options = {}) => {
    const groupId = options.fillTheGapGroupId
    const solutions = this.fillTheGapSolutions[groupId]
    solutions.push(gap.attrs.answer)

    return new TextRun({ text: '  ______  ' })
  }

  multipleChoiceOptionHandler = (multipleChoiceOption, options = {}) => {
    const { /* id, */ correct, feedback } = multipleChoiceOption.attrs
    const { multipleChoiceGroupId } = options

    this.multipleChoiceSolutions[multipleChoiceGroupId].push({
      correct,
      feedback,
    })

    return this.contentParser(multipleChoiceOption.content, options)
  }

  feedbackParser = () => {
    let content = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'Solutions',
            ...this.appendixHeaderStyles,
          }),
        ],
      }),
    ]

    const multipleChoiceSolutionKeys = Object.keys(this.multipleChoiceSolutions)

    multipleChoiceSolutionKeys.forEach((groupId, i) => {
      this.listInstance += 1
      const groupSolutions = this.multipleChoiceSolutions[groupId]

      let listContent = []

      if (multipleChoiceSolutionKeys.length > 1) {
        listContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Multiple choice question ${i + 1}`,
                bold: true,
              }),
            ],
          }),
        )
      }

      groupSolutions.forEach(option => {
        const isCorrect = new Paragraph({
          children: [
            new TextRun({
              text: option.correct ? 'Correct' : 'Not correct',
            }),
          ],
          numbering: {
            reference: this.listTypes.MULTIPLE_CHOICE,
            level: 0,
            instance: this.listInstance,
          },
          spacing: {
            after: 50,
          },
        })

        const feedback = new Paragraph({
          children: [new TextRun({ text: option.feedback })],
          indent: {
            left: convertMillimetersToTwip(7),
          },
        })

        listContent = listContent.concat([isCorrect, feedback])
      })

      content = content.concat(listContent)
    })

    const fillTheGapSolutionKeys = Object.keys(this.fillTheGapSolutions)

    fillTheGapSolutionKeys.forEach((groupId, i) => {
      this.listInstance += 1
      const groupSolutions = this.fillTheGapSolutions[groupId]

      const listContent = []

      if (fillTheGapSolutionKeys.length > 1) {
        listContent.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Fill the gap ${i + 1}`,
                bold: true,
              }),
            ],
          }),
        )
      }

      groupSolutions.forEach(gapSolution => {
        const acceptedAnswers = gapSolution
          .split(';')
          .map(s => s.trim())
          .join(', ')

        const solution = new Paragraph({
          children: [
            new TextRun({
              text: acceptedAnswers,
            }),
          ],
          numbering: {
            reference: this.listTypes.ORDERED,
            level: 0,
            instance: this.listInstance,
          },
          contextualSpacing: false,
          indent: {
            left: convertMillimetersToTwip(7),
          },
          spacing: {
            after: 100,
          },
        })

        listContent.push(solution)
      })

      const feedbackParagraph = new Paragraph({
        children: [
          new TextRun({
            text: this.fillTheGapFeedback[groupId],
          }),
        ],
      })

      listContent.push(feedbackParagraph)

      content = content.concat(listContent)
    })

    return content
  }

  metadataParser = () => {
    const content = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'Metadata',
            ...this.appendixHeaderStyles,
          }),
        ],
      }),
    ]

    const spacing = new TextRun({
      text: '  ',
    })

    Object.keys(this.metadata).forEach(key => {
      const value = this.metadata[key]

      if (typeof value === 'string') {
        content.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${key}:`,
                bold: true,
              }),
              spacing,
              new TextRun({
                text: value,
              }),
            ],
          }),
        )
      }

      if (Array.isArray(value)) {
        const hasStringValues = value.every(s => typeof s === 'string')
        const hasObjectValues = value.every(o => typeof o === 'object')

        if (hasStringValues) {
          const items = []

          value.forEach((s, pos) => {
            items.push(
              new TextRun({
                text: s,
              }),
            )

            // separate with commas
            if (pos !== value.length - 1) {
              items.push(
                new TextRun({
                  text: ', ',
                }),
              )
            }
          })

          content.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${key}:`,
                  bold: true,
                }),
                spacing,
                ...items,
              ],
            }),
          )
        } else if (hasObjectValues) {
          value.forEach((o, pos) => {
            this.listInstance += 1

            content.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${key} ${pos + 1}`,
                    bold: true,
                  }),
                ],
              }),
            )

            Object.keys(o).forEach(i => {
              content.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${i}:`,
                      bold: true,
                    }),
                    spacing,
                    new TextRun({
                      text: o[i],
                    }),
                  ],
                  numbering: {
                    reference: this.listTypes.BULLET,
                    level: 0,
                    instance: this.listInstance,
                  },
                }),
              )
            })
          })
        }
      }
    })

    return content
  }

  buildDocx = () => {
    const sections = [
      {
        children: this.contentParser(this.doc.content),
      },
    ]

    if (this.showFeedback) {
      sections.push({
        children: this.feedbackParser(),
      })
    }

    if (this.showMetadata) {
      sections.push({
        children: this.metadataParser(),
      })
    }

    return new Document({
      ...this.config,
      sections,
    })
  }
}

module.exports = HHMIWaxToDocxConverter
