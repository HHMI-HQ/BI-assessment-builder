import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Button, Steps } from '../common'

const Wrapper = styled.section`
  border-left: 1px solid ${th('colorBorder')};
  display: flex;
  flex-direction: column;
  padding: ${grid(4)};
  width: 100%;
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
  //   const [answers, setAnswers] = useState({})

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

  const onStepClick = step => {
    if (step < current) {
      setCurrent(step)
    } else if (step === current + 1) {
      // validate current step form, if filled out move to next step
    }
  }

  return (
    <Wrapper>
      <Steps
        current={current}
        items={[{}, {}, {}, {}]}
        onChange={onStepClick}
        type="inline"
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
