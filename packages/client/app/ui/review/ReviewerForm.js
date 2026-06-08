import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Button, Steps, Form } from '../common'
import RevewerStep1 from './ReviewerStep1'
import RevewerStep2 from './ReviewerStep2'
import ReviewerStep3 from './ReviewerStep3'
import ReviewerSubmitButton from './ReviewerSubmitButton'

const Wrapper = styled.section`
  border-left: 1px solid ${th('colorBorder')};
  display: flex;
  flex-direction: column;
  grid-row: span 2;
  overflow: auto;
  padding: ${grid(4)} ${grid(4)} ${grid(2)};
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

const checkProps = (data, keys) =>
  keys.every(key => Object.prototype.hasOwnProperty.call(data, key))

const checkConditionally = (data, keys, antecedent, consequent) =>
  (keys.some(key => key === antecedent) && !!consequent) ||
  keys.every(key => key !== antecedent)

const inferStep = data => {
  let step = 0

  if (checkProps(data, ['answeredCorrectly', 'difficulty'])) {
    step += 1
  }

  if (
    data.hasIssues === false
    // || (data.hasIssues && data.issuesIdentification && data.issuesDetails)
  ) {
    step += 1
  }

  if (
    checkProps(data, [
      'curriculaAlignment',
      'bloomLevel',
      'questionType',
      'feedbackEvaluation',
    ]) &&
    checkConditionally(
      data,
      ['multipleChoiceSingleCorrect', 'multipleChoice'],
      data.questionType,
      data.distractors,
    ) &&
    checkConditionally(
      data,
      ['hasIssues'],
      data.feedbackEvaluation,
      data.feedbackIssuesDetails.length > 0,
    ) &&
    checkConditionally(
      data,
      data.feedbackIssuesDetails,
      'other',
      data.otherIssues,
    )
  ) {
    step += 1
  }

  return step
}

const ReviewerForm = props => {
  const { saveReview, submitReview, responses } = props

  const [current, setCurrent] = useState(inferStep(responses))
  const [form] = Form.useForm()

  const previousStep = () => {
    if (current > 0) setCurrent(c => c - 1)
  }

  const nextStep = () => {
    form
      .validateFields()
      .then(() => {
        if (current < MAX_STEP_INDEX) setCurrent(c => c + 1)
      })
      .catch(e => {
        console.error(e)
      })
  }

  const renderFormStep = () => {
    switch (current) {
      case 0:
        return <RevewerStep1 />
      case 1:
        return <RevewerStep2 hasIssues={responses.hasIssues} />
      case 2:
        return (
          <ReviewerStep3
            feedbackEvaluation={responses.feedbackEvaluation}
            feedbackIssues={responses.feedbackIssuesDetails}
            questionType={responses.questionType}
          />
        )
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

  const renderFormButtons = () => {
    if (current === MAX_STEP_INDEX || (current === 1 && responses.hasIssues)) {
      return (
        <ReviewerSubmitButton onSubmit={submitReview} responses={responses} />
      )
    }

    return <Button onClick={nextStep}>Next</Button>
  }

  const onStepClick = step => {
    if (
      step < current ||
      (step > current &&
        step <= inferStep(responses) &&
        !(responses.hasIssues && step > 1))
    ) {
      setCurrent(step)
    }
  }

  const handleValuesChange = values => {
    saveReview(values)
  }

  return (
    <Wrapper>
      <Steps
        current={current}
        items={[{}, {}, {}, {}]}
        onChange={onStepClick}
        type="inline"
      />

      <Form
        autoSave
        form={form}
        initialValues={responses}
        layout="vertical"
        onAutoSave={handleValuesChange}
      >
        {renderFormStep()}
      </Form>

      <Footer>
        {current > 0 ? (
          <Button onClick={previousStep}>Previous</Button>
        ) : (
          <span />
        )}
        {renderFormButtons()}
        {/* {current < MAX_STEP_INDEX ||
          (responses.hasIssues && <Button onClick={nextStep}>Next</Button>)}
        {current === MAX_STEP_INDEX && (
          <Button onClick={submitReview} type="primary">
            Submit Review
          </Button>
        )} */}
      </Footer>
    </Wrapper>
  )
}

ReviewerForm.propTypes = {
  saveReview: PropTypes.func,
  submitReview: PropTypes.func,
  responses: PropTypes.shape(),
}

ReviewerForm.defaultProps = {
  saveReview: () => {},
  submitReview: () => {},
  responses: null,
}

export default ReviewerForm
