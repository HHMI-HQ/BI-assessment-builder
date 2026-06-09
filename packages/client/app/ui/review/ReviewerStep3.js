import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Divider, TextArea } from '@coko/client/dist/ui'
import { Input } from '../common'

import {
  FormHeading,
  InputWraper,
  StyledFormItem,
  StyledRadio,
  StyledCheckboxGroup,
  // options
  yesOrNoOptions,
  questionTypesOptions,
  distractorsOptions,
  feedbackEvaluationOptions,
  feedbackIssuesOptions,
} from './reviewerFormUI'

const Step3 = props => {
  const { questionType, feedbackEvaluation, feedbackIssues } = props

  const [distractors, setDistractors] = useState(
    questionType === 'multipleChoiceSingleCorrect' ||
      questionType === 'multipleChoice',
  )

  const [hasFeedbackIssues, setHasFeedbackIssues] = useState(
    feedbackEvaluation === 'hasIssues',
  )

  const [hasOtherIssues, setHasOtherIssues] = useState(
    feedbackIssues.indexOf('other') > -1,
  )

  const handleQuestionTypeChange = val => {
    if (val === 'multipleChoiceSingleCorrect' || val === 'multipleChoice') {
      setDistractors(true)
    } else {
      setDistractors(false)
    }
  }

  const handleFeedbackIssueChange = val => {
    if (val === 'hasIssues') {
      setHasFeedbackIssues(true)
    } else {
      setHasFeedbackIssues(false)
    }
  }

  const handlefeedbackIssuesChange = vals => {
    if (vals.indexOf('other') > -1) {
      setHasOtherIssues(true)
    } else {
      setHasOtherIssues(false)
    }
  }

  return (
    <>
      <FormHeading>Evaluate the Item in Educator Mode</FormHeading>
      <Divider />
      <InputWraper>
        <StyledFormItem
          label="Is the item aligned to the appropriate Learning Objective or Bioskills?"
          name="curriculaAlignment"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <StyledRadio name="hasIssues" options={yesOrNoOptions} vertical />
        </StyledFormItem>
        <StyledFormItem
          label={
            <span>
              Do you think that the item targets the Bloom’s level as written?
              See{' '}
              <a
                href="https://drive.google.com/file/d/1CvwdVchs06nl94ICbIcgz-sVsjblFAcS/view"
                rel="noreferrer"
                target="_blank"
              >
                Bloom&#39;s Taxonomy document
              </a>{' '}
              for reference, if needed.
            </span>
          }
          name="bloomLevel"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <StyledRadio name="bloomLevel" options={yesOrNoOptions} vertical />
        </StyledFormItem>

        <StyledFormItem
          label="Please provide feedback about the Learning Objective, Bioskills alignment, or Bloom's level."
          name="alignmentFeedback"
        >
          <TextArea />
        </StyledFormItem>
        <StyledFormItem
          label="What is the item type that you are reviewing?"
          name="questionType"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <StyledRadio
            name="questionType"
            onChange={handleQuestionTypeChange}
            options={questionTypesOptions}
            vertical
          />
        </StyledFormItem>
        {distractors && (
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
          <>
            <StyledFormItem
              label="You identified feedback-related issues; please select all that apply:"
              name="feedbackIssues"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <StyledCheckboxGroup
                name="feedbackIssues"
                onChange={handlefeedbackIssuesChange}
                options={feedbackIssuesOptions}
                vertical
              />
            </StyledFormItem>
            {hasOtherIssues && (
              <StyledFormItem
                label="Specify other feedback-related issues:"
                name="otherIssues"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </StyledFormItem>
            )}
            <StyledFormItem
              label="Please explain the issue(s) in greater detail:"
              name="feedbackIssuesDetails"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <TextArea />
            </StyledFormItem>
          </>
        )}
      </InputWraper>
    </>
  )
}

Step3.propTypes = {
  questionType: PropTypes.string,
  feedbackEvaluation: PropTypes.string,
  feedbackIssues: PropTypes.arrayOf(PropTypes.string),
}

Step3.defaultProps = {
  questionType: '',
  feedbackEvaluation: 'noIssues',
  feedbackIssues: [],
}

export default Step3
