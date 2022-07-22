import React, { useState } from 'react'

import { Discover, DateParser } from 'ui'
import { useQuery } from '@apollo/client'

import { metadataForQuestionPage as metadata } from '../utilities'
import { GET_PUBLISHED_QUESTIONS } from '../graphql'

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

const sidebarText = 'Find questions by aplying one or more of the filters below'

const PAGE_SIZE = 10

const transform = questions => {
  if (!questions) return null

  return questions.map(question => {
    const { id, versions } = question
    const latestVersion = versions[0]
    const { content, publicationDate, cognitiveLevel } = latestVersion
    const parsedContent = content ? JSON.parse(content) : null

    const courses = latestVersion.courses.map(c => {
      const courseInValues = metadata.frameworks.find(f => f.value === c.course)

      const beginning = c.course.slice(0, 2).toLowerCase()
      // const isIB = beginning === 'ib'
      const isAP = beginning === 'ap'

      const objectives = c.units.map(unit => ({
        label: courseInValues.learningObjectives?.find(
          lo => lo.value === unit.learningObjective,
        ).label,
      }))

      const understandings = c.units.map(unit => ({
        label: courseInValues.understandings?.find(
          und => und.value === unit.understanding,
        ).label,
      }))

      return {
        course: {
          label: courseInValues.label,
        },
        label: isAP ? 'learning objectives' : 'understandings',
        objectives: isAP ? objectives : understandings,
      }
    })

    const topics = latestVersion.topics
      .map(topic => {
        const topicObject = metadata.topics.find(t => t.value === topic?.topic)

        const subtopicObject = topicObject?.subtopics.find(
          s => s.value === topic.subtopic,
        )

        return {
          topic: topicObject.label,
          subtopic: subtopicObject.label,
        }
      })
      .reduce(
        (accumulator, topic, index, array) => {
          return {
            topics: `${accumulator.topics}${topic.topic}${
              index < array.length - 1 ? ', ' : ''
            }`,
            subtopics: `${accumulator.subtopics}${topic.subtopic}${
              index < array.length - 1 ? ', ' : ''
            }`,
          }
        },
        { topics: '', subtopics: '' },
      )

    const cognitiveValues = metadata.blooms.cognitive

    const allCognitiveOptions = [
      ...cognitiveValues[0].options,
      ...cognitiveValues[1].options,
    ]

    const cognitiveDisplayValue = allCognitiveOptions.find(
      o => o.value === cognitiveLevel,
    )?.label

    let status
    if (latestVersion.submitted) status = 'Submitted'
    if (latestVersion.underReview) status = 'Under review'
    if (latestVersion.published) status = 'Published'
    if (question.rejected) status = 'Rejected'

    return {
      metadata: [
        { label: 'topic', value: topics.topics },
        { label: 'subtopic', value: topics.subtopics },
        // question type: how do we know that data ?? what if it's more than one?
        { label: "bloom's level", value: cognitiveDisplayValue },
        {
          label: 'published date',
          value: (
            <DateParser dateFormat="MMMM DD, YYYY" timestamp={publicationDate}>
              {timestamp => timestamp}
            </DateParser>
          ),
        },
      ],
      content: parsedContent,
      status,
      href: `/question/${id}`,
      id,
      courses,
    }
  })
}

const DiscoverPage = () => {
  const [searchParams, setSearchParams] = useState({
    query: '',
    page: 1,
    filters: {},
    sortBy: 'date-des',
  })

  const { data: questionsData, loading } = useQuery(GET_PUBLISHED_QUESTIONS, {
    variables: {
      params: {
        filters: searchParams.filters,
        search: searchParams.query,
      },
      options: {
        page: searchParams.page - 1,
        pageSize: PAGE_SIZE,
      },
    },
  })

  const handleSearch = params => {
    setSearchParams(params)
  }

  return (
    <Discover
      loading={loading}
      onSearch={handleSearch}
      questions={
        questionsData && transform(questionsData.getPublishedQuestions.result)
      }
      showSort
      sidebarMetadata={metadata}
      sidebarText={sidebarText}
      sortOptions={sortOptions}
      totalCount={questionsData?.getPublishedQuestions.totalCount}
    />
  )
}

export default DiscoverPage
