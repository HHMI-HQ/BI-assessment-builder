/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react'
import { lorem } from 'faker'
import { uuid } from '@coko/client'
import { Dashboard, Button } from 'ui'
import styled from 'styled-components'
import { createData } from '../_helpers'
import {
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

const makeData = n =>
  createData(n, i => ({
    id: uuid(),
    title: lorem.words(6),
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
    status: ['Published', 'Submitted', 'Under review', 'Rejected'][
      Math.floor(Math.random() * 4)
    ],
    href: '#',
  }))

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

const totalResults = 33

const Wraper = styled.div`
  /* background: linear-gradient(97.37deg, #058d96 -34.57%, #8ac341 93.86%); */
  background-color: #a5a1a2;
  height: 90vh;
`

const searchFunction = params => {
  const data = makeData(
    totalResults - 10 * (params.page - 1) > 10
      ? 10
      : totalResults - 10 * (params.page - 1),
  )

  return data
}

export const AuthorDashboard = args => {
  const [loading, setLoading] = useState(false)

  const [author, setAuthorQuestions] = useState({
    questions: [],
    totalCount: 0,
  })

  const handleSearch = async params => {
    const { query = '', page = 1, sortBy, role } = params
    // eslint-disable-next-line no-console
    console.log(`${query}, ${page}, ${sortBy}, ${role}`)

    setLoading(true)
    setTimeout(() => {
      const data = searchFunction(params)

      if (role === 'author') {
        setAuthorQuestions({ questions: data, totalCount: totalResults })
      }

      setLoading(false)
    }, 500)
  }

  const CreateQuestion = <Button type="primary">Create Question</Button>

  const tabs = [
    {
      label: 'Authored Questions',
      value: 'author',
      questions: author.questions,
      totalCount: author.totalCount,
    },
  ]

  return (
    <Wraper>
      <Dashboard
        createQuestionButton={CreateQuestion}
        loading={loading}
        onSearch={handleSearch}
        tabsContent={tabs}
        {...args}
        showSort
        sortOptions={sortOptions}
      />
    </Wraper>
  )
}

export const EditorDashboard = args => {
  const [loading, setLoading] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState([])

  const [author, setAuthorQuestions] = useState({
    questions: [],
    totalCount: 0,
  })

  const [editor, setEditorQuestions] = useState({
    questions: [],
    totalCount: 0,
  })

  const handleSearch = async params => {
    const { query = '', page = 1, sortBy, role } = params
    // eslint-disable-next-line no-console
    console.log(`${query}, ${page}, ${sortBy}, ${role}`)

    setLoading(true)
    setTimeout(() => {
      const data = searchFunction(params)

      if (role === 'author') {
        setAuthorQuestions({ questions: data, totalCount: totalResults })
      } else if (role === 'editor') {
        setEditorQuestions({ questions: data, totalCount: totalResults })
      }

      setLoading(false)
    }, 500)
  }

  const handleBulkAction = () => {
    // eslint-disable-next-line no-console
    console.log(selectedQuestions)
  }

  const BulkAction = (
    <Button
      disabled={selectedQuestions.length === 0}
      onClick={handleBulkAction}
      type="primary"
    >
      Assign handling editor
    </Button>
  )

  const CreateQuestion = <Button type="primary">Create Question</Button>

  const tabs = [
    {
      label: 'Authored Questions',
      value: 'author',
      questions: author.questions,
      totalCount: author.totalCount,
    },
    {
      label: 'Editor Questions',
      value: 'editor',
      questions: editor.questions,
      totalCount: editor.totalCount,
      showBulkActions: true,
    },
  ]

  return (
    <Wraper>
      <Dashboard
        bulkActions={BulkAction}
        createQuestionButton={CreateQuestion}
        loading={loading}
        onQuestionSelected={setSelectedQuestions}
        onSearch={handleSearch}
        tabsContent={tabs}
        {...args}
        showSort
        sortOptions={sortOptions}
      />
    </Wraper>
  )
}

export default {
  component: Dashboard,
  title: 'Dashboard/Dashboard',
}
