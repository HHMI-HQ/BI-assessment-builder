/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { range } from 'lodash'
import { lorem } from 'faker'
import { uuid } from '@coko/client'
import { Discover, metadata } from 'ui'
import {
  flatAPCoursesMetadata,
  flatIBCourseMetadata,
  flatVisionAndChangeMetadata,
  flatAAMCMetadata,
  generateMetadata,
  getRandomLearningObjective,
  getRandomUnderstanding,
} from '../../app/utilities'

const learningObjectivesAndUnderstandings = () => {
  const total = Math.floor(Math.random() * 4) + 1
  const numberOfLOs = Math.floor(Math.random() * total)
  const numberOfUs = total - numberOfLOs

  const learningObjectives = []
  const understandings = []

  for (let i = 0; i < numberOfLOs; i += 1) {
    learningObjectives.push(getRandomLearningObjective().label)
  }

  for (let i = 0; i < numberOfUs; i += 1) {
    understandings.push(getRandomUnderstanding().label)
  }

  return {
    learningObjectives,
    understandings,
  }
}

const sortOptions = [
  {
    label: 'Date (ascending)',
    value: 'date-asc',
    isDefault: true,
  },
  {
    label: 'Date (descending)',
    value: 'date-des',
    isDefault: true,
  },
]

const makeData = n =>
  range(n).map(i => ({
    id: String(i + 1),
    description: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: lorem.sentences(8),
            },
          ],
        },
      ],
    },
    metadata: generateMetadata(),
    additionalMetadata: learningObjectivesAndUnderstandings(),
    href: `question/${uuid()}`,
  }))

const searchFunction = (params = {}) => {
  /* eslint-disable-next-line no-unused-vars */
  const { query = '', page = 1, filters, sortBy = 'date' } = params

  /* eslint-disable-next-line no-console */
  console.log(params)

  const numResults = 33
  const data = makeData(numResults)
  return data.slice(10 * (page - 1), 10 * page)
}

const Wrapper = styled.div`
  height: 90vh;
`

const sidebarText = lorem.sentences(7)

export const DiscoverPage = () => {
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  const [flatMetadata, setFlatMetadata] = useState(metadata)

  useEffect(() => {
    const frameworks = metadata.frameworks.map(framework => {
      const frameworkData = {
        label: framework.label,
        value: framework.value,
      }

      // const additionalMetadata = flatten(framework, {}, [])
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

    const introToBioMeta = metadata.introToBioMeta.map(data => {
      const meta = {
        label: data.label,
        value: data.value,
      }

      let additionalMetadata

      if (data.value === 'visionAndChange') {
        additionalMetadata = flatVisionAndChangeMetadata(data)
      }

      if (data.value === 'aamcFuturePhysicians') {
        additionalMetadata = flatAAMCMetadata(data)
      }

      return {
        ...meta,
        ...additionalMetadata,
      }
    })

    setFlatMetadata({
      topics: metadata.topics,
      blooms: metadata.blooms,
      frameworks,
      introToBioMeta,
    })
  }, [])

  const handleSearch = async params => {
    setLoading(true)

    setTimeout(() => {
      const data = searchFunction(params)
      setSearchResults(data)
      setLoading(false)
    }, 500)
  }

  return (
    <Wrapper>
      <Discover
        loading={loading}
        onSearch={handleSearch}
        questions={searchResults}
        showSort
        sidebarMetadata={flatMetadata}
        sidebarText={sidebarText}
        sortOptions={sortOptions}
        totalCount={33}
      />
    </Wrapper>
  )
}

const DiscoveryCustom = args => {
  const [flatMetadata, setFlatMetadata] = useState(metadata)

  useEffect(() => {
    const frameworks = metadata.frameworks.map(framework => {
      const frameworkData = {
        label: framework.label,
        value: framework.value,
      }

      // const additionalMetadata = flatten(framework, {}, [])
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

    const introToBioMeta = metadata.introToBioMeta.map(data => {
      const meta = {
        label: data.label,
        value: data.value,
      }

      let additionalMetadata

      if (data.value === 'visionAndChange') {
        additionalMetadata = flatVisionAndChangeMetadata(data)
      }

      if (data.value === 'aamcFuturePhysicians') {
        additionalMetadata = flatAAMCMetadata(data)
      }

      return {
        ...meta,
        ...additionalMetadata,
      }
    })

    setFlatMetadata({
      topics: metadata.topics,
      blooms: metadata.blooms,
      frameworks,
      introToBioMeta,
    })
  }, [])

  return (
    <Wrapper>
      <Discover
        {...args}
        sidebarMetadata={flatMetadata}
        sortOptions={sortOptions}
      />
    </Wrapper>
  )
}

export const CustomControls = DiscoveryCustom.bind({})
CustomControls.args = {
  questions: makeData(10),
  onSearch: () => {},
  totalCount: 10,
  sidebarText,
}

export default {
  component: Discover,
  title: 'Discover/Discover',
}
