/* eslint-disable no-console */

import React from 'react'
// import { lorem } from 'faker'

import { Metadata } from 'ui'

const options = [
  {
    label: 'One',
    value: 'one',
  },
  {
    label: 'Two',
    value: 'two',
  },
]

export const Base = () => (
  <Metadata
    cognitiveLevelOptions={options}
    coreCompetencyOptions={options}
    coreConceptOptions={options}
    frameworkOptions={options}
    onAutoSave={vals => console.log(vals)}
    principleOptions={options}
    programLevelOutcomeOptions={options}
    readingLevelOptions={options}
    sectionOptions={options}
    subDisciplineOptions={options}
    topicOptions={options}
    unitOptions={options}
  />
)

export default {
  component: Metadata,
  title: 'Question/Metadata',
}
