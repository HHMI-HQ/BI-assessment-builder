import React, { useState } from 'react'
import { lorem } from 'faker'
import { uuid } from '@coko/client'
import ListContent from '../../app/ui/myList/ListContent'
import {
  generateMetadata,
  getRandomCourse,
  getRandomObjectivesForCourse,
  getRandomStatus,
} from '../_utilities'
import { createData } from '../_helpers'

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
              text: lorem.sentences(8),
            },
          ],
        },
      ],
    },
    metadata: generateMetadata(),
    courses: courseData(),
    status: getRandomStatus(),
  }))

export const Base = args => {
  const [data, setData] = useState(makeData(5))
  const [currentPage, setCurrentPage] = useState(1)

  const handlePageChange = p => {
    setData(makeData(5))
    setCurrentPage(p)
  }

  return (
    <ListContent
      {...args}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      questions={data}
      showRowCheckboxes={false}
      showSearch={false}
      title="list 1"
    />
  )
}

Base.args = {
  totalCount: 15,
  showRowCheckboxes: true,
  questionsPerPage: 5,
}

export default {
  component: ListContent,
  title: 'myList/ListContent',
}
