/* stylelint-disable declaration-no-important */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { Steps } from 'antd'

const Wrapper = styled.section`
  padding: ${grid(4)};
`

const StyledSteps = styled(Steps)`
  display: flex !important;

  .ant-steps-item {
    flex: 1 !important;
  }

  .ant-steps-item-icon {
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    width: 30px;
  }
`

const ReviewerForm = props => {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})

  const content = 'Reviewer form'

  return (
    <Wrapper>
      <StyledSteps
        current={current}
        items={[
          {
            title: 'Step 1',
          },
          {
            title: 'Step 2',
          },
          {
            title: 'Step 3',
          },
          {
            title: 'Step 4',
          },
        ]}
        type="inline"
        //   onChange={onChange}
      />
    </Wrapper>
  )
}

export default ReviewerForm
