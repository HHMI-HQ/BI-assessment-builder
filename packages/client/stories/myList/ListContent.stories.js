import React, { useState } from 'react'
import { lorem } from 'faker'
import styled from 'styled-components'
import { uuid } from '@coko/client'
import { ListContent } from 'ui'
import {
  generateMetadata,
  getRandomCourse,
  getRandomObjectivesForCourse,
  getRandomStatus,
} from '../../app/utilities/question/_utils'
import { createData } from '../../app/utilities/_helpers'

const courseData = () => {
  const courses = []
  const nrOfCourses = Math.floor(Math.random() * 2 + 1) // 1-2
  const previousCourses = []

  for (let i = 0; i < nrOfCourses; i += 1) {
    const course = getRandomCourse(previousCourses)
    previousCourses.push(course)
    const objectives = getRandomObjectivesForCourse(course)
    courses.push({
      course,
      objectives: objectives.list,
      label: objectives.label,
    })
  }

  return courses
}

const makeData = n =>
  createData(n, i => ({
    id: uuid(),
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: lorem.sentences(5),
            },
          ],
        },
      ],
    },
    metadata: generateMetadata(),
    courses: courseData(),
    status: getRandomStatus(),
  }))

const Wrapper = styled.div`
  height: 900px;
`

export const Base = args => {
  const { questionsPerPage, totalCount } = args
  const [data, setData] = useState(makeData(questionsPerPage))
  const [loading, setLoading] = useState(false)

  const handleSearch = params => {
    // eslint-disable-next-line no-console
    console.log(params)
    setLoading(true)
    setTimeout(() => {
      setData(
        makeData(
          Math.min(
            params.pageSize,
            totalCount,
            totalCount - params.pageSize * (params.page - 1),
          ),
        ),
      )
      setLoading(false)
    }, 500)
  }

  const handleDragEnd = result => {
    const { destination, source /* draggableId */ } = result

    // check if no destination, or if no rearrangement happened
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    // reorder the elements (depends on how we want to persist data, this is just a demo)
    const newDataSource = [...data]
    const draggedElement = newDataSource.splice(source.index, 1)
    newDataSource.splice(destination.index, 0, ...draggedElement)

    setData(newDataSource)
  }

  return (
    <Wrapper>
      <ListContent
        {...args}
        loading={loading}
        onDragEnd={handleDragEnd}
        onSearch={handleSearch}
        questions={data}
        showSearch={false}
        title="list name"
      />
    </Wrapper>
  )
}

Base.args = {
  totalCount: 21,
  showRowCheckboxes: true,
  questionsPerPage: 10,
}

export default {
  component: ListContent,
  title: 'myList/ListContent',
}
