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
      data.feedbackIssues?.length > 0 && data.feedbackIssuesDetails,
    ) &&
    checkConditionally(data, data.feedbackIssues, 'other', data.otherIssues)
  ) {
    step += 1
  }

  if (checkConditionally(data, [true], data.concerns, data.concernsSpecifics)) {
    step += 1
  }

  return step
}

const ReviewerForm = props => {
  const { saveReview, submitReview, responses, showDialog, reviewSubmitted } =
    props

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
    if (reviewSubmitted) {
      return <ReviewerStep5 responses={responses} reviewSubmitted />
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
            questionType={responses.questionType}
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

      if (
        current === MAX_STEP_INDEX ||
        (current === 1 && responses.hasIssues)
      ) {
        rightButton = (
          <ReviewerSubmitButton
            onSubmit={submitReview}
            showDialog={showDialog}
          />
        )
      }

      rightButton = <Button onClick={nextStep}>Next</Button>

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
  responses: PropTypes.shape(),
  reviewSubmitted: PropTypes.bool,
}

ReviewerForm.defaultProps = {
  saveReview: () => {},
  submitReview: () => {},
  showDialog: () => {},
  responses: null,
  reviewSubmitted: false,
}

export default ReviewerForm
