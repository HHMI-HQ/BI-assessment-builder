/* eslint-disable no-case-declarations */
const cloneDeep = require('lodash/cloneDeep')

const {
  BaseModel,
  modelJsonSchemaTypes: {
    arrayOfStrings,
    boolean,
    dateNullable,
    id,
    idNullable,
    objectNullable,
    string,
    stringNullable,
    integerPositive,
    arrayOfIds,
    object,
  },
  uuid,
} = require('@coko/server')

const {
  extractDocumentText,
  hasRoleHelper,
  createFeedback,
} = require('../helpers')

const Question = require('../question/question.model')
const ComplexItemSet = require('../complexItemSet/complexItemSet.model')

class QuestionVersion extends BaseModel {
  static get tableName() {
    return 'questionVersions'
  }

  constructor(properties) {
    super(properties)
    this.type = 'questionVersion'
  }

  static get relationMappings() {
    return {
      question: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionVersions.questionId',
          to: 'questions.id',
        },
      },
      complexItemSet: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: ComplexItemSet,
        join: {
          from: 'question_versions.complexItemSetId',
          to: 'complexItemSets.id',
        },
      },
    }
  }

  $parseJson(json, opt) {
    const data = super.$parseJson(json, opt)

    // transform stringified wax content to json before storing in the db
    if (data.content && typeof data.content === 'string') {
      data.content = JSON.parse(data.content)

      // clean up potentially invalid src attribute from data
      // (urls from the file server expire and will be generated on fetch)
      if (data.content) {
        const cleanUpUrls = node => {
          if (!node.content) return node

          const modifiedNode = cloneDeep(node)

          modifiedNode.content = node.content
            .map(item => {
              if (item.type === 'figure') {
                const clonedItem = cloneDeep(item)

                // when figure lacks content (not proprely deleted from user) ignore it
                if (!clonedItem.content) {
                  return null
                }

                const { src } = clonedItem.content[0].attrs

                if (src) {
                  // make sure non-url existing images are not deleted
                  if (src.startsWith('data:image')) return item

                  clonedItem.content[0].attrs.src = null
                  return clonedItem
                }

                // if image is missing a src replace it with empty paragraph
                return {
                  type: 'paragraph',
                  attrs: {
                    class: 'paragraph',
                  },
                  content: [
                    {
                      text: ' ',
                      type: 'text',
                    },
                  ],
                }
              }

              return cleanUpUrls(item)
            })
            .filter(item => !!item)

          return modifiedNode
        }

        data.content = cleanUpUrls(data.content)
      }

      // store pure text of the question separately (for use in searching)
      data.contentText = extractDocumentText(data.content)
    }

    return data
  }

  static get schema() {
    return {
      properties: {
        questionId: id,
        complexItemSetId: idNullable,
        dependsOn: arrayOfIds,

        content: objectNullable,
        contentText: stringNullable,

        submitted: boolean,
        editing: boolean,
        accepted: boolean,
        underReview: boolean,
        inProduction: boolean,
        published: boolean,
        unpublished: boolean,

        publicationDate: dateNullable,
        submittedOn: dateNullable,

        topics: {
          type: 'array',
          default: [],
          items: {
            type: 'object',
            required: ['topic'],
            additionalProperties: false,
            properties: {
              topic: string,
              subtopic: stringNullable,
            },
          },
        },

        courses: {
          type: ['array', 'null'],
          default: [],
          items: object,
        },

        // courses: {
        //   type: arrayOfObjectsNullable,
        //   items: {
        //     type: 'object',
        //     // required: ['course', 'units'],
        //     properties: {
        //       course: 'string',
        //       units: {
        //         type: 'array',
        //         default: [],
        //         items: {
        //           type: 'object',
        //           required: [],
        //           additionalProperties: false,
        //           properties: {
        //             unit: stringNullable,
        //             courseTopic: stringNullable,
        //             // AP courses
        //             essentialKnowledge: stringNullable,
        //             learningObjective: stringNullable,
        //             // IB courses
        //             application: stringNullable,
        //             skill: stringNullable,
        //             understanding: stringNullable,
        //             // vision and change
        //             coreConcept: stringNullable,
        //             subdiscipline: stringNullable,
        //             subdisciplineStatement: stringNullable,
        //             coreCompetence: stringNullable,
        //             subcompetence: stringNullable,
        //             subcompetenceStatement: stringNullable,
        //             // aamc metadata
        //             concept: stringNullable,
        //             category: stringNullable,
        //           },
        //         },
        //       },
        //     },
        //   },
        // },

        keywords: arrayOfStrings,
        biointeractiveResources: arrayOfStrings,

        cognitiveLevel: stringNullable,
        affectiveLevel: stringNullable,
        psychomotorLevel: stringNullable,
        readingLevel: stringNullable,
        literatureAttribution: stringNullable,

        questionType: stringNullable,
        lastEdit: dateNullable,

        amountOfReviewers: integerPositive,
        isReviewerAutomationOn: boolean,
        reviewerPool: arrayOfIds,
        enhancedEditor: boolean,
      },
    }
  }

  static async hasRole(userId, manuscriptVersionId, role) {
    return hasRoleHelper(userId, manuscriptVersionId, role)
  }

  async hasRole(userId, role) {
    return hasRoleHelper(userId, this.id, role)
  }

  static async upgradeContent(questionVersionId, options) {
    const qv = await QuestionVersion.findById(questionVersionId, options)
    const itemContent = structuredClone(qv.content)

    const questionTypeIndex = itemContent.content.findIndex(c =>
      [
        'multiple_choice_container',
        'multiple_choice_single_correct_container',
        'true_false_container',
        'true_false_single_correct_container',
        'matching_container',
        'fill_the_gap_container',
        'numerical_answer_container',
        'multiple_drop_down_container',
        'essay_container',
      ]?.includes(c.type),
    )

    const itemType = itemContent.content[questionTypeIndex].type
    let elementsWithFeedback

    switch (itemType) {
      case 'multiple_choice_container':
        elementsWithFeedback = itemContent.content[
          questionTypeIndex
        ].content.filter(c => c.type === 'multiple_choice')

        elementsWithFeedback.forEach(opt => {
          const index = itemContent.content[0].content.findIndex(
            o => o.attrs.id === opt.attrs.id,
          )

          itemContent.content[0].content.splice(
            index + 1,
            0,
            createFeedback(opt.attrs.feedback),
          )
        })
        break

      case 'multiple_choice_single_correct_container':
        elementsWithFeedback = itemContent.content[
          questionTypeIndex
        ].content.filter(c => c.type === 'multiple_choice_single_correct')

        elementsWithFeedback.forEach(opt => {
          const index = itemContent.content[
            questionTypeIndex
          ].content.findIndex(o => o.attrs.id === opt.attrs.id)

          itemContent.content[questionTypeIndex].content.splice(
            index + 1,
            0,
            createFeedback(opt.attrs.feedback),
          )
        })
        break

      case 'true_false_container':
        elementsWithFeedback = itemContent.content[
          questionTypeIndex
        ].content.filter(c => c.type === 'true_false')

        elementsWithFeedback.forEach(opt => {
          const index = itemContent.content[
            questionTypeIndex
          ].content.findIndex(o => o.attrs.id === opt.attrs.id)

          itemContent.content[0].content.splice(
            index + 1,
            0,
            createFeedback(opt.attrs.feedback),
          )
        })
        break

      case 'true_false_single_correct_container':
        elementsWithFeedback = itemContent.content[
          questionTypeIndex
        ].content.filter(c => c.type === 'true_false_single_correct')

        elementsWithFeedback.forEach(opt => {
          const index = itemContent.content[
            questionTypeIndex
          ].content.findIndex(o => o.attrs.id === opt.attrs.id)

          itemContent.content[0].content.splice(
            index + 1,
            0,
            createFeedback(opt.attrs.feedback),
          )
        })
        break

      case 'matching_container':
        const { feedback: matchingFeedback } =
          itemContent.content[questionTypeIndex].attrs

        itemContent.content[questionTypeIndex] = {
          type: 'matching_wrapper',
          attrs: {
            id: uuid(),
            class: 'matching-wrapper',
          },
          content: [
            itemContent.content[questionTypeIndex],
            createFeedback(matchingFeedback),
          ],
        }
        break

      case 'fill_the_gap_container':
        const { feedback: fillTheGapFeedback } =
          itemContent.content[questionTypeIndex].attrs

        itemContent.content[questionTypeIndex] = {
          type: 'fill_the_gap_wrapper',
          attrs: {
            id: uuid(),
            class: 'fill-the-gap-wrapper',
          },
          content: [
            itemContent.content[questionTypeIndex],
            createFeedback(fillTheGapFeedback),
          ],
        }
        break

      case 'numerical_answer_container':
        const { feedback: numericalFeedback } =
          itemContent.content[questionTypeIndex].attrs

        itemContent.content[questionTypeIndex] = {
          type: 'numerical_wrapper',
          attrs: {
            id: uuid(),
            class: 'numerical-wrapper',
          },
          content: [
            itemContent.content[questionTypeIndex],
            createFeedback(numericalFeedback),
          ],
        }
        break

      case 'multiple_drop_down_container':
        const { feedback: mddFeedback } =
          itemContent.content[questionTypeIndex].attrs

        itemContent.content[questionTypeIndex] = {
          type: 'multiple_drop_down_wrapper',
          attrs: {
            id: uuid(),
            class: 'multiple-drop-down-wrapper',
          },
          content: [
            itemContent.content[questionTypeIndex],
            createFeedback(mddFeedback),
          ],
        }

        break

      default:
        break
    }

    return QuestionVersion.patchAndFetchById(
      questionVersionId,
      {
        enhancedEditor: true,
        content: itemContent,
      },
      options,
    )
  }
}

module.exports = QuestionVersion
