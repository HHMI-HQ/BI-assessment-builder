/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'

import { QuestionItem } from 'ui'
import {
  generateMetadata,
  getRandomLearningObjective,
  getRandomUnderstanding,
  getRandomStatus,
  questionContentExample,
  questionContentExample2,
  questionContentExample3,
} from '../../app/utilities'

const meta = generateMetadata()

const extraMeta = {
  learningObjectives: [getRandomLearningObjective().label],
  understandings: [getRandomUnderstanding().label],
}

export const Base = args => (
  <QuestionItem
    additionalMetadata={extraMeta}
    status={getRandomStatus()}
    {...args}
    content={questionContentExample3}
    metadata={meta}
  />
)

export const WithLearningObjectives = () => (
  <QuestionItem
    additionalMetadata={{
      learningObjectives: [
        getRandomLearningObjective().label,
        getRandomLearningObjective().label,
      ],
    }}
    content={questionContentExample3}
    metadata={meta}
    status={getRandomStatus()}
    title={getRandomLearningObjective().label}
  />
)

export const WithUnderstandings = () => (
  <QuestionItem
    additionalMetadata={{
      understandings: [
        getRandomUnderstanding().label,
        getRandomUnderstanding().label,
      ],
    }}
    content={questionContentExample3}
    metadata={meta}
    status={getRandomStatus()}
    title={getRandomLearningObjective().label}
  />
)

export const WithLearningObjectivesAndUnderstandings = () => (
  <QuestionItem
    additionalMetadata={{
      learningObjectives: [getRandomLearningObjective().label],
      understandings: [getRandomUnderstanding().label],
    }}
    content={questionContentExample3}
    metadata={meta}
    status={getRandomStatus()}
    title={getRandomLearningObjective().label}
  />
)

export default {
  component: QuestionItem,
  title: 'Common/QuestionItem',
  argTypes: {
    status: {
      control: 'select',
      options: ['Published', 'Submitted', 'Under review', 'Rejected'],
    },
  },
}
