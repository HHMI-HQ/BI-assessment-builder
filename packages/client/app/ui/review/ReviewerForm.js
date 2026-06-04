import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Button, Steps, Form } from '../common'
import RevewerStep1 from './ReviewerStep1'

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
  const [form] = Form.useForm()

  const previousStep = () => {
    if (current > 0) setCurrent(c => c - 1)
  }

  const nextStep = () => {
    form.validateFields().then(() => {
      if (current < MAX_STEP_INDEX) setCurrent(c => c + 1)
    })
  }

  const renderFormStep = () => {
    switch (current) {
      case 0:
        return <RevewerStep1 />
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

      <Form form={form} layout="vertical">
        {renderFormStep()}
      </Form>

      <Footer>
        {current > 0 ? (
          <Button onClick={previousStep}>Previous</Button>
        ) : (
          <span />
        )}
        {current < MAX_STEP_INDEX && <Button onClick={nextStep}>Next</Button>}
        {current === MAX_STEP_INDEX && (
          <Button onClick={submitReview} type="primary">
            Submit Review
          </Button>
        )}
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
