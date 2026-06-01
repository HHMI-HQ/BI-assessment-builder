import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Divider, TextArea } from '@coko/client/dist/ui'

import {
  FormHeading,
  InputWraper,
  StyledFormItem,
  StyledRadio,
  // options
  distractorsOptions,
  feedbackEvaluationOptions,
  itemsWithDistractors,
} from './reviewerFormUI'

const Step3 = props => {
  const { questionType, feedbackEvaluation } = props

  const [hasFeedbackIssues, setHasFeedbackIssues] = useState(
    feedbackEvaluation === 'hasIssues',
  )

  const handleFeedbackIssueChange = val => {
    if (val === 'hasIssues') {
      setHasFeedbackIssues(true)
    } else {
      setHasFeedbackIssues(false)
    }
  }

  return (
    <>
      <FormHeading>Evaluate the Item in Educator Mode</FormHeading>
      <Divider />
      <InputWraper>
        {itemsWithDistractors.includes(questionType.metadataValue) && (
          <StyledFormItem
            label="Evaluating item distractors:"
            name="distractors"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <StyledRadio
              name="distractors"
              options={distractorsOptions}
              vertical
            />
          </StyledFormItem>
        )}
        <StyledFormItem
          label="Evaluating the feedback for the correct and incorrect options."
          name="feedbackEvaluation"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <StyledRadio
            name="feedbackEvaluation"
            onChange={handleFeedbackIssueChange}
            options={feedbackEvaluationOptions}
            vertical
          />
        </StyledFormItem>
        {hasFeedbackIssues && (
          <StyledFormItem
            label="You identified feedback-related issues; please explain the issue(s) in greater detail:"
            name="feedbackIssuesDetails"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea />
          </StyledFormItem>
        )}
      </InputWraper>
    </>
  )
}

Step3.propTypes = {
  questionType: PropTypes.shape(),
  feedbackEvaluation: PropTypes.string,
}

Step3.defaultProps = {
  questionType: {},
  feedbackEvaluation: 'noIssues',
}

export default Step3
