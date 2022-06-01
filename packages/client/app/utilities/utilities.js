import { isEmpty, uniqBy } from 'lodash'
import flatMetadataValues from '../ui/_helpers/flatMetadataValues'
import {
  topics as topicsMetadata,
  frameworks as frameworksMeta,
} from '../ui/question/metadataValues'

const apDictionary = [
  'unit',
  'frameworkTopic',
  'learningObjective',
  'essentialKnowledge',
]

const visionAndChangeDictionary = ['coreConcept', 'subDiscipline', 'statement']

const objectCleaner = obj =>
  Object.entries(obj)
    .map(([k, v]) => [k, v && typeof v === 'object' ? objectCleaner(v) : v])
    /* eslint-disable-next-line no-param-reassign */
    .reduce((a, [k, v]) => (v == null ? a : ((a[k] = v), a)), {})

const questionDataTransformer = ({
  framework,
  topic,
  subTopic,
  keywords,
  affectiveLevel,
  biointeractiveResources,
  cognitiveLevel,
  psychomotorLevel,
  readingLevel,
  supplementaryFields,
  ...rest
}) => {
  const result = {
    framework,
    topic,
    subTopic,
    affectiveLevel,
    biointeractiveResources,
    cognitiveLevel,
    psychomotorLevel,
    readingLevel,
    supplementaryFields: [],
    frameworkMetadata: {},
  }

  if (supplementaryFields?.length > 0) {
    const transformedSupplementaryFields = []
    supplementaryFields.forEach((item, index) => {
      const temp = {
        topic: item.topic || null,
        subTopic: item?.subTopic || null,
      }

      if (framework && framework === 'visionAndChange') {
        temp.frameworkMetadata = {}
        visionAndChangeDictionary.forEach(key => {
          temp.frameworkMetadata[`${key}`] = item[key] || null
        })
      }

      if (
        framework &&
        (framework === 'apBiology' || framework === 'apEnvironmentalScience')
      ) {
        temp.frameworkMetadata = {}
        apDictionary.forEach(key => {
          temp.frameworkMetadata[`${key}`] = item[key] || null
        })
      }

      transformedSupplementaryFields.push(temp)
    })

    if (transformedSupplementaryFields.length > 0) {
      result.supplementaryFields = transformedSupplementaryFields
    }
  }

  if (framework && framework === 'visionAndChange') {
    visionAndChangeDictionary.forEach(value => {
      if (rest[`${framework}.${value}`]) {
        result.frameworkMetadata[value] = rest[`${framework}.${value}`]
      }
    })
  }

  if (
    framework &&
    (framework === 'apBiology' || framework === 'apEnvironmentalScience')
  ) {
    apDictionary.forEach(value => {
      if (rest[`${framework}.${value}`]) {
        result.frameworkMetadata[value] = rest[`${framework}.${value}`]
      }
    })
  }

  if (isEmpty(result.frameworkMetadata)) {
    delete result.frameworkMetadata
  }

  result.keywords = keywords

  return result
}

const questionDataMapper = ({
  framework,
  keywords,
  affectiveLevel,
  biointeractiveResources,
  cognitiveLevel,
  psychomotorLevel,
  readingLevel,
  topic,
  subTopic,
  frameworkMetadata,
  supplementaryFields,
}) => {
  const result = {
    framework,
    topic,
    subTopic,
    keywords,
    affectiveLevel,
    biointeractiveResources,
    cognitiveLevel,
    psychomotorLevel,
    readingLevel,
  }

  if (supplementaryFields.length > 0) {
    const transformedSupplementaryFields = []
    supplementaryFields.forEach((item, index) => {
      const temp = { topic: item.topic, subTopic: item.subTopic }

      if (
        framework &&
        framework === 'visionAndChange' &&
        item.frameworkMetadata
      ) {
        visionAndChangeDictionary.forEach(key => {
          temp[`${key}`] = item.frameworkMetadata[key]
        })
      }

      if (
        framework &&
        item.frameworkMetadata &&
        (framework === 'apBiology' || framework === 'apEnvironmentalScience')
      ) {
        apDictionary.forEach(key => {
          temp[`${key}`] = item.frameworkMetadata[key]
        })
      }

      transformedSupplementaryFields.push(temp)
    })
    result.supplementaryFields = transformedSupplementaryFields
  }

  if (framework && framework === 'visionAndChange' && frameworkMetadata) {
    visionAndChangeDictionary.forEach(value => {
      result[`${framework}.${value}`] = frameworkMetadata[value]
    })
  }

  if (
    framework &&
    frameworkMetadata &&
    (framework === 'apBiology' || framework === 'apEnvironmentalScience')
  ) {
    apDictionary.forEach(value => {
      result[`${framework}.${value}`] = frameworkMetadata[value]
    })
  }

  return result
}

const displayNameExtractor = (label, value) => {
  switch (label) {
    case 'topic': {
      const found = flatMetadataValues.topics.find(t => t.value === value)

      if (!found) {
        return undefined
      }

      return found.label
    }

    case 'subTopic': {
      const found = flatMetadataValues.subTopics.find(s => s.value === value)

      if (!found) {
        return undefined
      }

      return found.label
    }

    case 'cognitiveLevel': {
      const found = flatMetadataValues.blooms.cognitive.find(
        t => t.value === value,
      )

      if (!found) {
        return undefined
      }

      return found.label
    }

    case 'affectiveLevel': {
      const found = flatMetadataValues.blooms.affective.find(
        t => t.value === value,
      )

      if (!found) {
        return undefined
      }

      return found.label
    }

    case 'psychomotorLevel': {
      const found = flatMetadataValues.blooms.psychomotor.find(
        t => t.value === value,
      )

      if (!found) {
        return undefined
      }

      return found.label
    }

    default: {
      return undefined
    }
  }
}

const dashboardDataMapper = data => {
  return data.map(item => {
    return {
      title: 'Title placeholder',
      id: item.id,
      content: item.versions[0].content,
      metadata: [
        {
          label: 'topic',
          value: displayNameExtractor('topic', item.versions[0].topic),
        },
        {
          label: 'subTopic',
          value: displayNameExtractor('subTopic', item.versions[0].subTopic),
        },
        {
          label: 'cognitiveLevel',
          value: displayNameExtractor(
            'cognitiveLevel',
            item.versions[0].cognitiveLevel,
          ),
        },
        {
          label: 'affectiveLevel',
          value: displayNameExtractor(
            'affectiveLevel',
            item.versions[0].affectiveLevel,
          ),
        },
        {
          label: 'psychomotorLevel',
          value: displayNameExtractor(
            'psychomotorLevel',
            item.versions[0].psychomotorLevel,
          ),
        },
      ],
    }
  })
}

const profileOptions = {
  institutionalSetting: [
    {
      label: 'Urban',
      value: 'urban',
    },
    {
      label: 'Rural',
      value: 'rural',
    },
    {
      label: 'Online Institution',
      value: 'online',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ],
  institutionLevels: [
    {
      label: 'Middle School',
      value: 'middleSchool',
    },
    {
      label: 'High School',
      value: 'highSchool',
    },
    {
      label: '2-year college',
      value: '2-year-college',
    },
    {
      label: '2-year college',
      value: '4-year-college',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ],
  courses: [
    {
      label: 'Biology',
      value: 'biology',
    },
    {
      label: 'Biochemistry & Molecular Biology',
      value: 'biochemistryMolecularBiology',
    },
    {
      label: 'Genetics',
      value: 'genetics',
    },
    {
      label: 'Cell Biology',
      value: 'cellBiology',
    },
    {
      label: 'Microbiology',
      value: 'microbiology',
    },
    {
      label: 'Anatomy & Physiology',
      value: 'anatomyPhysiology',
    },
    {
      label: 'Evolutionary Biology',
      value: 'evolutionaryBiology',
    },
    {
      label: 'Ecology',
      value: 'ecology',
    },
    {
      label: 'Environmental Science',
      value: 'environmentalScience',
    },
    {
      label: 'Earth Science',
      value: 'earthScience',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ],
  topics: [
    {
      label: 'Biochemistry & Molecular Biology',
      value: 'biochemistryMolecularBiology',
    },
    {
      label: 'Genetics',
      value: 'genetics',
    },
    {
      label: 'Cell biology',
      value: 'cellBiology',
    },
    {
      label: 'Diversity of life',
      value: 'diversityOfLife',
    },
    {
      label: 'Anatomy & Physiology',
      value: 'anatomyPhysiology',
    },
    {
      label: 'Evolution',
      value: 'evolution',
    },
    {
      label: 'Ecology',
      value: 'ecology',
    },
    {
      label: 'Environmental science',
      value: 'environmentalScience',
    },
    {
      label: 'Earth science',
      value: 'earthScience',
    },
    {
      label: 'Science practices',
      value: 'sciencePractices',
    },
  ],
}

const flatAPCoursesMetadata = data => {
  const units = []
  const topics = []
  const learningObjectives = []
  const essentialKnowledge = []

  data.units.forEach(unit => {
    units.push({
      label: unit.label,
      value: unit.value,
    })

    unit.topics.forEach(topic => {
      topics.push({
        label: topic.label,
        value: topic.value,
        unit: unit.value,
      })

      topic.learningObjectives.forEach(lo => {
        learningObjectives.push({
          label: lo.label,
          value: lo.value,
          unit: unit.value,
          topic: topic.value,
        })

        lo.essentialKnowledge.forEach(ek => {
          essentialKnowledge.push({
            label: ek.label,
            value: ek.value,
            unit: unit.value,
            topic: topic.value,
            learningObjective: lo.value,
          })
        })
      })
    })
  })

  return {
    units,
    topics,
    learningObjectives, // : uniqBy(learningObjectives, 'value'),
    essentialKnowledge,
  }
}

const flatIBCourseMetadata = data => {
  const units = []
  const topics = []
  const applications = []
  const skills = []
  const understandings = []

  data.units.forEach(unit => {
    units.push({
      label: unit.label,
      value: unit.value,
    })

    unit.topics.forEach(topic => {
      topics.push({
        label: topic.label,
        value: topic.value,
        unit: unit.value,
      })

      topic.applications.forEach(application => {
        applications.push({
          label: application.label,
          value: application.value,
          unit: unit.value,
          topic: topic.value,
        })
      })

      if (topic.skills) {
        topic.skills.forEach(skill => {
          skills.push({
            label: skill.label,
            value: skill.value,
            unit: unit.value,
            topic: topic.value,
          })
        })
      }

      topic.understandings.forEach(understanding => {
        understandings.push({
          label: understanding.label,
          value: understanding.value,
          unit: unit.value,
          topic: topic.value,
        })
      })
    })
  })

  return {
    units,
    topics,
    applications,
    skills,
    understandings,
  }
}

const flatVisionAndChangeMetadata = data => {
  const coreConcepts = []
  const subdisciplines = []
  const subdisciplineStatements = []

  const coreCompetencies = []
  const subcompetencies = []
  const subcompetenceStatements = []

  data.coreConcepts.forEach(coreConcept => {
    coreConcepts.push({
      label: coreConcept.label,
      value: coreConcept.value,
      explanatoryItems: coreConcept.explanatoryItems,
    })

    coreConcept.subdisciplines.forEach(subdiscipline => {
      subdisciplines.push({
        label: subdiscipline.label,
        value: subdiscipline.value,
        // coreConcept: they all share the same subdisciplines,
      })

      subdiscipline.statements.forEach(statement => {
        subdisciplineStatements.push({
          label: statement.label,
          value: statement.value,
          coreConcept: coreConcept.value,
          subdiscipline: subdiscipline.value,
        })
      })
    })
  })

  data.coreCompetencies.forEach(coreCompetence => {
    coreCompetencies.push({
      label: coreCompetence.label,
      value: coreCompetence.value,
    })

    coreCompetence.subcompetencies.forEach(subcompetence => {
      subcompetencies.push({
        label: subcompetence.label,
        value: subcompetence.value,
        explanation: subcompetence.explanation,
        coreCompetence: coreCompetence.value,
      })

      subcompetence.statements.forEach(statement => {
        subcompetenceStatements.push({
          label: statement.label,
          value: statement.value,
          subcompetence: subcompetence.value,
          coreCompetence: coreCompetence.value,
        })
      })
    })
  })

  return {
    coreConcepts,
    subdisciplines: uniqBy(subdisciplines, 'value'),
    subdisciplineStatements,
    coreCompetencies,
    subcompetencies,
    subcompetenceStatements,
  }
}

const flatAAMCMetadata = data => {
  const concepts = []
  const categories = []

  data.concepts.forEach(concept => {
    concepts.push({
      label: concept.label,
      value: concept.value,
    })

    concept.categories.forEach(category => {
      categories.push({
        label: category.label,
        value: category.value,
        explanation: category.explanation,
        concept: concept.value,
      })
    })
  })

  return {
    concepts,
    categories,
  }
}

// works for AP and IB courses
// eslint-disable-next-line no-unused-vars
const flatten = (data, obj, tags = []) => {
  const objCopy = obj
  Object.keys(data).forEach(key => {
    if (typeof data[key] !== 'string') {
      if (!obj[key]) {
        objCopy[key] = []
      }

      data[key].forEach(u => {
        objCopy[key].push(
          Object.assign(
            {},
            {
              label: u.label,
              value: u.value,
            },
            ...tags,
          ),
        )

        const childTags = [...tags]
        childTags.push({ [key.slice(0, -1)]: u.value })

        flatten(u, objCopy, childTags)
      })
    } else if (!objCopy[key]) {
      objCopy[key] = data[key]
    }
  })

  return obj
}

const generateMetadata = () => {
  const questionTypes = [
    {
      value: 'multipleChoice',
      label: 'Multiple choice',
    },
    {
      value: 'multipleChoiceSingleCorrect',
      label: 'Multiple choice (single correct)',
    },
    {
      value: 'trueFalse',
      label: 'True / False',
    },
    {
      value: 'trueFalseSingleCorrect',
      label: 'True / False (single correct)',
    },
    {
      value: 'fillInTheBlank',
      label: 'Fill in the blank',
    },
    {
      value: 'essay',
      label: 'Essay',
    },
    {
      value: 'matching',
      label: 'Matching',
    },
    {
      value: 'multipleDropdowns',
      label: 'Multiple dropdowns',
    },
  ]

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const randomTopic =
    topicsMetadata[Math.floor(Math.random() * topicsMetadata.length)]

  const randomSubtopic =
    randomTopic.subTopics[
      Math.floor(Math.random() * randomTopic.subTopics.length)
    ]

  const randomQuestionType =
    questionTypes[Math.floor(Math.random() * questionTypes.length)]

  const randomBloomLevel =
    flatMetadataValues.blooms.cognitive[
      Math.floor(Math.random() * flatMetadataValues.blooms.cognitive.length)
    ]

  const randomDate = () => {
    const start = new Date(2022, 4, 1)
    const end = new Date()
    const date = new Date(+start + Math.random() * (end - start))

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  return [
    {
      label: 'topic',
      value: randomTopic.label,
    },
    {
      label: 'subtopic',
      value: randomSubtopic.label,
    },
    {
      label: 'question type',
      value: randomQuestionType.label,
    },
    {
      label: "bloom's level",
      value: randomBloomLevel.label,
    },
    {
      label: 'published date',
      value: randomDate(),
    },
  ]
}

const getRandomLearningObjective = () => {
  const randomAPCourse = frameworksMeta[Math.floor(Math.random() * 2)]
  const flatMetadata = flatAPCoursesMetadata(randomAPCourse)
  return flatMetadata.learningObjectives[
    Math.floor(Math.random() * flatMetadata.learningObjectives.length)
  ]
}

const getRandomUnderstanding = () => {
  const randomIBCourse = frameworksMeta[Math.floor(2 + Math.random() * 2)]
  const flatMetadata = flatIBCourseMetadata(randomIBCourse)
  return flatMetadata.understandings[
    Math.floor(Math.random() * flatMetadata.understandings.length)
  ]
}

const getRandomStatus = () =>
  ['Published', 'Submitted', 'Under review', 'Rejected'][
    Math.floor(Math.random() * 4)
  ]

const questionContentExample = {
  type: 'true_false_container',
  attrs: {
    id: 'd2c7e30d-5467-43c9-bff7-d65d8dec1974',
    class: 'true-false',
  },
  content: [
    {
      type: 'question_node_true_false',
      attrs: {
        id: '3396aa04-acb6-450d-99ec-a1ec06bd7a61',
        class: 'true-false-question',
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
              text:
                'Does the question look good in the dashboard? (adding some more text here, since we don’t know yet which text will be displayed in the dashboard/discover page, the one in the question body, or the context the we gave above it. I hope this much text is enough for the test we want to make.)',
            },
          ],
        },
      ],
    },
    {
      type: 'true_false',
      attrs: {
        class: 'true-false-option',
        id: '3fec656e-7880-43c5-a532-7dc05531a128',
        correct: false,
        answer: false,
        feedback: '',
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
              text: 'Question looks great, don’t need to worry about it',
            },
          ],
        },
      ],
    },
    {
      type: 'true_false',
      attrs: {
        class: 'true-false-option',
        id: '9884b720-dd0b-4804-8e10-3a8b392f52fc',
        correct: false,
        answer: false,
        feedback: '',
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
              text: 'Question looks terrible, go back and style it differently',
            },
          ],
        },
      ],
    },
    {
      type: 'true_false',
      attrs: {
        class: 'true-false-option',
        id: '60806815-bdc1-4e1e-8878-63185847bb5d',
        correct: true,
        answer: false,
        feedback:
          'Since we are setting the correct answers before actually testing how it looks, this is the only reasonable answer to mark as true. Maybe the user will disagree with us, but this is not up to them to decide.',
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
              text: 'Beauty is in the eyes of the beholder',
            },
          ],
        },
      ],
    },
  ],
}

const questionContentExample2 = {
  type: 'multiple_choice_single_correct_container',
  attrs: {
    id: 'a3c2fe97-4a16-4dd7-b924-ac7614323f78',
    class: 'multiple-choice-single-correct',
    correctId: '',
  },
  content: [
    {
      type: 'question_node_multiple_single',
      attrs: {
        id: '50d77ca0-87b9-49b7-b1db-5eea23e00206',
        class: 'multiple-choice-question-single',
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
              text: 'Under what circumstances does coral bleaching occur?',
            },
          ],
        },
      ],
    },
    {
      type: 'multiple_choice_single_correct',
      attrs: {
        class: 'multiple-choice-option-single-correct',
        id: '842fa93b-3679-4671-8a42-b604c245a7ea',
        correct: false,
        answer: false,
        feedback:
          'Stressful environmental conditions — such as sudden or prolonged changes in temperature, sunlight, or oxygen — can disrupt the symbiosis between the corals and their algae. Corals may then force the algae out of their cells in a process called coral bleaching. Since the algae give corals their color, corals turn white after bleaching.',
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
              text: 'Stressful environmental conditions',
            },
          ],
        },
      ],
    },
    {
      type: 'multiple_choice_single_correct',
      attrs: {
        class: 'multiple-choice-option-single-correct',
        id: '89ce42d0-f370-403c-836c-ef1da9d335b7',
        correct: false,
        answer: false,
        feedback: '',
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
              text: 'Presence of underwater predators',
            },
          ],
        },
      ],
    },
    {
      type: 'multiple_choice_single_correct',
      attrs: {
        class: 'multiple-choice-option-single-correct',
        id: 'e1311759-16cd-4a18-a48b-927721f8414f',
        correct: false,
        answer: false,
        feedback: '',
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
              text: 'Mercury in retrograde',
            },
          ],
        },
      ],
    },
  ],
}

const questionContentExample3 = {
  type: 'paragraph',
  attrs: {
    class: 'paragraph',
  },
  content: [
    {
      type: 'text',
      text:
        'Figures a and c show two different species of corals from a reef off the Caribbean coast of Panama. Parts of both corals have undergone bleaching, which is indicated by the arrows pointing to the white areas.',
    },
  ],
}

export {
  objectCleaner,
  questionDataTransformer,
  questionDataMapper,
  dashboardDataMapper,
  profileOptions,
  flatAPCoursesMetadata,
  flatIBCourseMetadata,
  flatVisionAndChangeMetadata,
  flatAAMCMetadata,
  generateMetadata,
  getRandomLearningObjective,
  getRandomUnderstanding,
  getRandomStatus,
  questionContentExample,
  questionContentExample2,
  questionContentExample3,
}
