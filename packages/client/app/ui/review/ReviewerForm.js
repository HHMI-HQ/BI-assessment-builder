/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { Steps } from 'antd'

const ReviewerForm = props => {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})

  const content = 'Reviewer form'

  return (
    <Steps
      current={current}
      items={[
        {
          title: 'A',
          content,
        },
        {
          title: 'B',
          content,
        },
        {
          title: 'C',
          content,
        },
        {
          title: 'D',
          content,
        },
      ]}
      //   onChange={onChange}
    />
  )
}

export default ReviewerForm
