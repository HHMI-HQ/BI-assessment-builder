const {
  BaseModel,
  modelTypes: {
    arrayOfStrings,
    boolean,
    dateNullable,
    id,
    objectNullable,
    string,
    stringNullable,
  },
} = require('@coko/server')

class QuestionVersion extends BaseModel {
  static get tableName() {
    return 'questionVersions'
  }

  constructor(properties) {
    super(properties)
    this.type = 'questionVersion'
  }

  static get relationMappings() {
    // eslint-disable-next-line global-require
    const Question = require('../question/question.model')

    return {
      question: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Question,
        join: {
          from: 'questionVersions.questionId',
          to: 'questions.id',
        },
      },
    }
  }

  $parseJson(json, opt) {
    const data = super.$parseJson(json, opt)

    if (data.content && typeof data.content === 'string') {
      data.content = JSON.parse(data.content)
    }

    return data
  }

  static get schema() {
    return {
      properties: {
        questionId: id,
        content: objectNullable,

        submitted: boolean,
        underReview: boolean,
        published: boolean,
        publicationDate: dateNullable,

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
          type: 'array',
          default: [],
          items: {
            type: 'object',
            required: ['course', 'units'],
            properties: {
              course: 'string',
              units: {
                type: 'array',
                default: [],
                items: {
                  type: 'object',
                  required: [],
                  additionalProperties: false,
                  properties: {
                    application: stringNullable,
                    coreCompetence: stringNullable,
                    coreConcept: stringNullable,
                    courseTopic: stringNullable,
                    essentialKnowledge: stringNullable,
                    learningObjective: stringNullable,
                    skill: stringNullable,
                    subcompetence: stringNullable,
                    subcompetenceStatement: stringNullable,
                    subdiscipline: stringNullable,
                    subdisciplineStatement: stringNullable,
                    understanding: stringNullable,
                    unit: stringNullable,
                  },
                },
              },
            },
          },
        },

        keywords: arrayOfStrings,
        biointeractiveResources: arrayOfStrings,

        cognitiveLevel: stringNullable,
        affectiveLevel: stringNullable,
        psychomotorLevel: stringNullable,
        readingLevel: stringNullable,
      },
    }
  }
}

module.exports = QuestionVersion
