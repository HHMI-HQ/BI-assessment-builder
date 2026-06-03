/* stylelint-disable declaration-no-important */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Steps } from 'antd'
import { Button } from '../common'

const Wrapper = styled.section`
  border-left: 1px solid ${th('colorBorder')};
  display: flex;
  flex-direction: column;
  padding: ${grid(4)};
  width: 100%;
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

const FormHeading = styled.h3`
  text-align: center;
  text-wrap: balance;
`

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  margin-block-start: auto;
`

const MAX_STEP_INDEX = 3

const ReviewerForm = props => {
  const { submitReview } = props

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})

  const content = 'Reviewer form'

  const previousStep = () => {
    if (current > 0) setCurrent(c => c - 1)
  }

  const nextStep = () => {
    if (current < MAX_STEP_INDEX) setCurrent(c => c + 1)
  }

  const renderFormStep = () => {
    switch (current) {
      case 0:
        return (
          <FormHeading>Analyze the Assessment Item in Learner Mode</FormHeading>
        )
      case 1:
        return <FormHeading>Evaluate the Content in Educator Mode</FormHeading>
      case 2:
        return <FormHeading>Evaluate the Item in Educator Mode</FormHeading>
      case 3:
        return (
          <FormHeading>
            Evaluate the Formatin & Writing Style in Educator Mode
          </FormHeading>
        )

      default:
        return null
    }
  }

  return (
    <Wrapper>
      <StyledSteps
        current={current}
        items={[{}, {}, {}, {}]}
        type="inline"
        //   onChange={onChange}
      />

      {renderFormStep()}

      <Footer>
        {current > 0 ? (
          <Button onClick={previousStep}>Previous</Button>
        ) : (
          <span />
        )}
        {current < 3 && <Button onClick={nextStep}>Next</Button>}
        {current === 3 && <Button onClick={submitReview}>Submit Review</Button>}
      </Footer>
    </Wrapper>
  )
}

ReviewerForm.propTypes = {
  submitReview: PropTypes.func,
}

ReviewerForm.defaultProps = {
  submitReview: () => {},
}

export default ReviewerForm
