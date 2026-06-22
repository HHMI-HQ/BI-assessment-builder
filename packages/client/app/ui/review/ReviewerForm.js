import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Button, Steps, Form } from '../common'
import RevewerStep1 from './ReviewerStep1'
import RevewerStep2 from './ReviewerStep2'
import ReviewerStep3 from './ReviewerStep3'
import ReviewerStep4 from './ReviewerStep4'
import ReviewerStep5 from './ReviewerStep5'
import ReviewerSubmitButton from './ReviewerSubmitButton'
import { itemsWithDistractors } from './reviewerFormUI'

const Wrapper = styled.section`
  border-left: 1px solid ${th('colorBorder')};
  display: flex;
  flex-direction: column;
  grid-row: span 2;
  overflow: auto;
  padding: ${grid(4)} ${grid(4)} ${grid(2)};
  width: 100%;
`

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  margin-block-start: auto;
`

const MAX_STEP_INDEX = 4

const checkProps = (data, keys) =>
  keys.every(key => Object.prototype.hasOwnProperty.call(data, key))

const checkConditionally = (data, keys, antecedent, consequent) =>
  (keys?.some(key => key === antecedent) && !!consequent) ||
  keys?.every(key => key !== antecedent)

const inferStep = (data, questionType) => {
  let step = 0

  if (checkProps(data, ['answeredCorrectly', 'difficulty'])) {
    step += 1
  }

  if (step === 1 && data.hasIssues === false) {
    step += 1
  }

  if (
    step === 2 &&
    checkConditionally(
      data,
      itemsWithDistractors,
      questionType,
      data.distractors,
    ) &&
    checkProps(data, ['feedbackEvaluation']) &&
    checkConditionally(
      data,
      ['hasIssues'],
      data.feedbackEvaluation,
      data.feedbackIssuesDetails,
    )
  ) {
    step += 1
  }

  if (
    step === 3 &&
    checkProps(data, ['concerns']) &&
    checkConditionally(data, data.concerns, 'clarity', data.clarityConcerns) &&
    checkConditionally(
      data,
      data.concerns,
      'grammatical',
      data.grammaticalConcerns,
    ) &&
    checkConditionally(data, data.concerns, 'other', data.otherConcerns)
  ) {
    step += 1
  }

  if (data.hasIssues && !!data.issuesDetails) {
    step = MAX_STEP_INDEX
  }

  return step
}

const ReviewerForm = props => {
  const {
    questionType,
    saveReview,
    submitReview,
    responses,
    showDialog,
    reviewSubmitted,
    numberOfResponses,
    setReviewerIndex,
  } = props

  const [current, setCurrent] = useState(inferStep(responses, questionType))
  const [form] = Form.useForm()

  const previousStep = () => {
    if (responses.hasIssues && current === MAX_STEP_INDEX) {
      setCurrent(1)
    } else if (current > 0) setCurrent(c => c - 1)
  }

  const nextStep = () => {
    form
      .validateFields()
      .then(data => {
        if (current === 1 && data.hasIssues) {
          setCurrent(MAX_STEP_INDEX)
        } else if (current < MAX_STEP_INDEX) setCurrent(c => c + 1)
      })
      .catch(e => {
        console.error(e)
      })
  }

  const renderFormStep = () => {
    if (reviewSubmitted) {
      return (
        <ReviewerStep5
          numberOfResponses={numberOfResponses}
          responses={responses}
          reviewSubmitted
          setReviewerIndex={setReviewerIndex}
        />
      )
    }

    switch (current) {
      case 0:
        return <RevewerStep1 />
      case 1:
        return <RevewerStep2 hasIssues={responses.hasIssues} />
      case 2:
        return (
          <ReviewerStep3
            feedbackEvaluation={responses.feedbackEvaluation}
            feedbackIssues={responses.feedbackIssues}
            questionType={questionType}
          />
        )
      case 3:
        return (
          <ReviewerStep4
            concerns={responses.concerns}
            concernsSpecifics={responses.concernsSpecifics}
          />
        )
      case 4:
        return <ReviewerStep5 responses={responses} />

      default:
        return null
    }
  }

  const renderFormButtons = () => {
    if (!reviewSubmitted) {
      const leftButton =
        current > 0 ? (
          <Button onClick={previousStep}>Previous</Button>
        ) : (
          <span />
        )

      let rightButton

      if (current === MAX_STEP_INDEX) {
        rightButton = (
          <ReviewerSubmitButton
            onSubmit={submitReview}
            showDialog={showDialog}
          />
        )
      } else {
        rightButton = <Button onClick={nextStep}>Next</Button>
      }

      return (
        <>
          {leftButton}
          {rightButton}
        </>
      )
    }

    return null
  }

  const onStepClick = step => {
    if (responses.hasIssues && responses.issuesDetails && step > 1) {
      setCurrent(MAX_STEP_INDEX)
    } else if (
      step < current ||
      (step > current &&
        step <= inferStep(responses, questionType) &&
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
      {!reviewSubmitted && (
        <Steps
          current={current}
          items={[{}, {}, {}, {}, {}]}
          onChange={onStepClick}
          type="inline"
        />
      )}

      <Form
        autoSave
        form={form}
        initialValues={responses}
        layout="vertical"
        onAutoSave={handleValuesChange}
      >
        {renderFormStep()}
      </Form>

      <Footer>{renderFormButtons()}</Footer>
    </Wrapper>
  )
}

ReviewerForm.propTypes = {
  saveReview: PropTypes.func,
  submitReview: PropTypes.func,
  showDialog: PropTypes.func,
  setReviewerIndex: PropTypes.func,
  responses: PropTypes.shape(),
  reviewSubmitted: PropTypes.bool,
  questionType: PropTypes.shape(),
  numberOfResponses: PropTypes.number,
}

ReviewerForm.defaultProps = {
  saveReview: () => {},
  submitReview: () => {},
  showDialog: () => {},
  setReviewerIndex: () => {},
  responses: null,
  reviewSubmitted: false,
  questionType: {},
  numberOfResponses: 1,
}

export default ReviewerForm
