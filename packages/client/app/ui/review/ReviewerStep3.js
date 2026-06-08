import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { Divider, TextArea } from '@coko/client/dist/ui'
import { Form, Radio, CheckboxGroup, Input } from '../common'

const FormHeading = styled.h3`
  text-align: center;
  text-wrap: balance;
`

const InputWraper = styled.div`
  padding: ${grid(2)};
`

const StyledFormItem = styled(Form.Item)`
  margin-block-end: ${grid(8)};

  .ant-form-item-label {
    margin-block-end: ${grid(4)};

    label {
      align-items: flex-start;

      &::before {
        margin-block-start: ${grid(1)};
      }
    }
  }
`

const StyledRadio = styled(Radio)`
  padding-inline: ${grid(2)};

  label:not(:first-child) {
    margin-block-start: ${grid(1)};
  }
`

const StyledCheckboxGroup = styled(CheckboxGroup)`
  padding-inline: ${grid(2)};

  label:not(:first-child) {
    margin-block-start: ${grid(1)};
  }

  .ant-checkbox {
    align-self: self-start;
    margin-top: 3px;
  }
`

const yesOrNoOptions = [
  {
    label: 'Yes',
    value: true,
  },
  {
    label: 'No',
    value: false,
  },
]

const feedbackEvaluationOptions = [
  {
    label: 'There are NO issues related to the feedback',
    value: 'noIssues',
  },
  {
    label: 'There are issues with the feedback',
    value: 'hasIssues',
  },
]

const questionTypes = [
  {
    value: 'essay',
    label: 'Essay',
  },
  {
    value: 'matching',
    label: 'Matching',
  },
  {
    value: 'multipleChoiceSingleCorrect',
    label: 'Multiple Choice',
  },
  {
    value: 'multipleChoice',
    label: 'Multiple Answers',
  },
  {
    value: 'trueFalse',
    label: 'Multiple True / False',
  },
  {
    value: 'numerical',
    label: 'Numerical Answer',
  },
  {
    value: 'trueFalseSingleCorrect',
    label: 'True / False',
  },

  {
    value: 'fillInTheBlank',
    label: 'Fill-in-the-blank',
  },
  {
    value: 'multipleDropdowns',
    label: 'Multiple Dropdowns',
  },
]

const distractorsOptions = [
  {
    value: 'appropriate',
    label: 'The distractors are appropriate',
  },
  {
    value: 'multipleDistractors',
    label:
      'There are multiple correct answers, or it is not clear which answer is correct',
  },
  {
    value: 'externalKnowledge',
    label:
      'Knowledge outside the assessed LO is needed to eliminate distractors',
  },
  {
    value: 'misconceptions',
    label: 'Not all distractors address common misconceptions of the content',
  },
]

const feedbackIssuesDetailsOptions = [
  {
    value: 'factualErrors',
    label: 'The feedback contains one or more factual errors',
  },
  {
    value: 'detailsLacking',
    label: 'The feedback lacks details or is not fully explanatory',
  },
  {
    value: 'hintsToCorrectAnswer',
    label:
      'Incorrect response feedback includes information for the correct answer, thereby limiting multiple attempts at the same item',
  },
  {
    value: 'other',
    label: 'There are other feedback-related issues',
  },
]

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

  const handlefeedbackIssuesDetailsChange = vals => {
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
          <StyledRadio
            // aria-label="Do you teach AP/IB courses?"
            name="hasIssues"
            options={yesOrNoOptions}
            vertical
          />
        </StyledFormItem>
        <StyledFormItem
          label="Do you think that the item targets the Bloom’s level as written? See Bloom's Taxonomy document for reference, if needed."
          name="bloomLevel"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <StyledRadio
            // aria-label="Do you teach AP/IB courses?"
            name="bloomLevel"
            options={yesOrNoOptions}
            vertical
          />
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
            options={questionTypes}
            vertical
          />
        </StyledFormItem>
        {distractors && (
          <StyledFormItem
            label="Evaluating item distractors"
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
              name="feedbackIssuesDetails"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <StyledCheckboxGroup
                name="feedbackIssuesDetails"
                onChange={handlefeedbackIssuesDetailsChange}
                options={feedbackIssuesDetailsOptions}
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
