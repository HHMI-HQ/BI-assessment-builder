import React from 'react'
import { MetadataInfo } from 'ui'
import metadataForQuestionPage from './_helpers/metadataValues'
import resources from './_helpers/resourcesData'

// console.log(metadata)

const metadataValues = {
  questionType: 'trueFalseSingleCorrect',
  topics: [
    { topic: 'genetics', subtopic: 'patternsOfInheritance' },
    { topic: 'cellBiology', subtopic: 'cellStructureFunction' },
  ],
  courses: [
    {
      course: 'apEnvironmentalScience',
      units: [
        {
          application: null,
          courseTopic: 'nuclearPower',
          essentialKnowledge: 'ENG-3.H.1',
          learningObjective: 'ENG-3.H',
          skill: null,
          understanding: null,
          unit: 'energyResourcesAndConsumption',
        },
      ],
    },
    {
      course: 'biEnvironmentalScience',
      units: [
        {
          unit: 'ecosystemsAndEcology',
          courseTopic: 'communitiesAndEcosystems',
          application: 'IBES-A2.2.3',
          understanding: 'IBES-U2.2.4',
        },
      ],
    },
  ],
  biointeractiveResources: [
    'biochemistryAndCellSignalingPathwayOfTheMc1rGene',
    'cysticFibrosisMechanismAndTreatment',
  ],
  cognitiveLevel: 'higher-understand',
}

export const Base = () => {
  return (
    <MetadataInfo
      metadata={metadataForQuestionPage}
      resources={resources}
      values={metadataValues}
    />
  )
}

export default {
  component: MetadataInfo,
  title: 'Question/MetadataInfo',
}
