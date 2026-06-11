import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { Divider } from '@coko/client/dist/ui/common'
import {
  FormHeading,
  InputWraper,
  ExplanatoryParagraph,
  yesOrNoOptions,
  difficultyOptions,
  hasIssuesOptions,
  distractorsOptions,
  feedbackEvaluationOptions,
  concernsOptions,
} from './reviewerFormUI'

const Label = styled.div`
  font-weight: bold;
  margin-block-start: ${grid(4)};
`

const Answer = styled.div`
  margin-block-start: ${grid(1)};
`

const InfoWrapper = styled.div`
  p {
    margin-top: 0;
  }
`

const renderAnswer = (options, answer) => {
  return options.find(o => o.value === answer)?.label
}

const renderAnswersList = (options, answers) => {
  const labels = options
    .filter(o => answers.indexOf(o.value) >= 0)
    .map(a => <li key={a.label}>{a.label}</li>)

  return <ul>{labels}</ul>
}

const Step5 = props => {
  const { responses, reviewSubmitted } = props

  const renderHeader = () => {
    if (reviewSubmitted) {
      return <FormHeading>Your review has been submitted</FormHeading>
    }

    return (
      <>
        <FormHeading>Review your responses</FormHeading>
        <ExplanatoryParagraph>
          If you are comfortable with your responses, please submit your review.
          Alternatively, you may go back and modify your answers or come back to
          this item review at a later time.
        </ExplanatoryParagraph>
      </>
    )
  }

  return (
    <>
      {!responses.reviewerName && renderHeader()}

      <InputWraper>
        {responses.reviewerName && (
          <InfoWrapper>
            <p>
              <strong>Reviewer: </strong>
              {responses.reviewerName}
            </p>
            <p>
              <strong>Email: </strong>
              {responses.reviewerEmail}
            </p>
            <Divider />
          </InfoWrapper>
        )}
        {/* step 1 */}
        <Label>Did you answer the item correctly?</Label>
        <Answer>
          {renderAnswer(yesOrNoOptions, responses.answeredCorrectly)}
        </Answer>
        <Label>
          Were there any barriers or points of confusion for you in answering
          this item?
        </Label>
        <Answer>{responses.barriers || '-'}</Answer>
        <Label>
          In the context of your biology course, the content assessed by this
          item is:
        </Label>
        <Answer>{renderAnswer(difficultyOptions, responses.difficulty)}</Answer>
        {/* step 2 */}
        <Label>Evaluating content</Label>
        <Answer>{renderAnswer(hasIssuesOptions, responses.hasIssues)}</Answer>
        {responses.hasIssues ? (
          <>
            <Label>
              You identified content-related issues; please explain in greater
              detail:
            </Label>
            <Answer>{responses.issuesDetails}</Answer>
          </>
        ) : (
          <>
            {/*  step 3 */}
            {responses.distractors && (
              <>
                <Label>Evaluating item distractors:</Label>
                <Answer>
                  {renderAnswer(distractorsOptions, responses.distractors)}
                </Answer>
              </>
            )}
            <Label>
              Evaluating the feedback for the correct and incorrect options.
            </Label>
            <Answer>
              {renderAnswer(
                feedbackEvaluationOptions,
                responses.feedbackEvaluation,
              )}
            </Answer>
            {responses.feedbackEvaluation === 'hasIssues' && (
              <>
                <Label>
                  You identified feedback-related issues; please explain the
                  issue(s) in greater detail:
                </Label>
                <Answer>{responses.feedbackIssuesDetails}</Answer>
              </>
            )}

            {/* step 4 */}
            <Label>The construction of this item has:</Label>
            <Answer>
              {renderAnswersList(concernsOptions, responses.concerns)}
            </Answer>
            {responses.concerns.includes('clarity') && (
              <>
                <Label>
                  If clarity-related issue(s) are noted, please explain in
                  detail.
                </Label>
                <Answer>{responses.clarityConcerns}</Answer>
              </>
            )}
            {responses.concerns.includes('grammatical') && (
              <>
                <Label>
                  If grammatical or structural issues are noted, please explain
                  in detail.
                </Label>
                <Answer>{responses.grammaticalConcerns}</Answer>
              </>
            )}
            {responses.concerns.includes('other') && (
              <>
                <Label>
                  If other item construction concerns are noted, please explain
                  in detail.
                </Label>
                <Answer>{responses.otherConcerns}</Answer>
              </>
            )}
            <Label>
              Do you have any additional suggestions for improving the item as
              written?
            </Label>
            <Answer>{responses.suggestions || '-'}</Answer>
          </>
        )}
      </InputWraper>
    </>
  )
}

Step5.propTypes = {
  responses: PropTypes.shape(),
  reviewSubmitted: PropTypes.bool,
}

Step5.defaultProps = {
  responses: null,
  reviewSubmitted: false,
}

export default Step5
