import React from 'react'

import Select from '../Select'
import { renderer } from '../../../testUtils'

const options = [
  {
    __typename: 'CognitiveBloomsLevelMetadata',
    label: 'Higher-order',
    options: [
      {
        __typename: 'SimpleValueLabelPair',
        label: 'Understand (higher-order)',
        value: 'higher-understand',
      },
      {
        __typename: 'SimpleValueLabelPair',
        label: 'Apply',
        value: 'higher-apply',
      },
      {
        __typename: 'SimpleValueLabelPair',
        label: 'Analyze',
        value: 'higher-analyze',
      },
      {
        __typename: 'SimpleValueLabelPair',
        label: 'Evaluate',
        value: 'higher-evaluate',
      },
      {
        __typename: 'SimpleValueLabelPair',
        label: 'Create',
        value: 'higher-create',
      },
    ],
  },
  {
    __typename: 'CognitiveBloomsLevelMetadata',
    label: 'Lower-order',
    options: [
      {
        __typename: 'SimpleValueLabelPair',
        label: 'Remember',
        value: 'lower-remember',
      },
      {
        __typename: 'SimpleValueLabelPair',
        label: 'Understand (lower-order)',
        value: 'lower-understand',
      },
    ],
  },
]

const MockSelect = props => {
  return (
    <Select
      data-testid="test-select"
      mode="multiple"
      options={options}
      showSearch={false}
      virtual={false}
      wrapOptionText={false}
      {...props}
    />
  )
}

describe('Select', () => {
  it('matches snapshot', () => {
    const selectComponent = renderer.create(<MockSelect />).toJSON()
    expect(selectComponent).toMatchSnapshot()
  })
})
