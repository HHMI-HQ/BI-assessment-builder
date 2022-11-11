/* eslint-disable no-unused-vars */
const { uniqBy } = require('lodash')
const metadata = require('./metadataValues')

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

const frameworks = metadata.frameworks
  .map(framework => {
    const frameworkData = {
      label: framework.label,
      value: framework.value,
    }

    let additionalMetadata

    if (
      framework.value === 'apBiology' ||
      framework.value === 'apEnvironmentalScience'
    ) {
      additionalMetadata = flatAPCoursesMetadata(framework)
    }

    if (
      framework.value === 'biBiology' ||
      framework.value === 'biEnvironmentalScience'
    ) {
      additionalMetadata = flatIBCourseMetadata(framework)
    }

    return {
      ...frameworkData,
      ...additionalMetadata,
    }
  })
  // temporarily filter out Intro to Biology courses
  .filter(
    framework =>
      framework.value !== 'introductoryBiologyForNonMajors' &&
      framework.value !== 'introductoryBiologyForMajors',
  )

const metadataResolver = () => {
  return {
    topics: metadata.topics,
    frameworks,
    questionTypes: metadata.questionTypes,
    blooms: metadata.blooms,
  }
}

module.exports = metadataResolver
