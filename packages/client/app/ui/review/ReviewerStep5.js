import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { Divider } from '@coko/client/dist/ui/common'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  PaperClipOutlined,
} from '@ant-design/icons'
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
import { Button } from '../common'

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

const ResponsesNavigator = styled.p`
  align-items: center;
  display: flex;
  justify-content: space-between;

  button {
    border: none;
    box-shadow: none;
  }
`

const AttachmentsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  > :last-child:not(:first-child) {
    margin-block-start: ${grid(2)};
  }
`

const AttachmentItem = styled.a`
  cursor: pointer;
  text-decoration: underline;

  > .anticon {
    margin-inline-end: ${grid(1)};
  }

  &:focus {
    outline: 2px solid ${th('colorPrimaryBorder')};
    outline-offset: 1px;
  }
`

const renderAnswer = (options, answer) => {
  return options.find(o => o.value === answer)?.label
}

const renderAnswersList = (options, answers) => {
  const labels = options
    .filter(o => answers?.includes(o.value))
    .map(a => <li key={a.label}>{a.label}</li>)

  return <ul>{labels}</ul>
}

const Step5 = props => {
  const { responses, reviewSubmitted, numberOfResponses, setReviewerIndex } =
    props

  const renderHeader = () => {
    if (reviewSubmitted) {
      return <FormHeading>Your responses have been submitted.</FormHeading>
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

  const navigateReviews = dir => {
    dir < 0
      ? setReviewerIndex(
          val => (val + numberOfResponses - 1) % numberOfResponses,
        )
      : setReviewerIndex(val => (val + 1) % numberOfResponses)
  }

  return (
    <>
      {!responses.reviewerName && renderHeader()}

      <InputWraper>
        {responses.reviewerName && (
          <InfoWrapper>
            {numberOfResponses > 1 && (
              <ResponsesNavigator>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigateReviews(-1)}
                />
                <Button
                  icon={<ArrowRightOutlined />}
                  onClick={() => navigateReviews(1)}
                />
              </ResponsesNavigator>
            )}
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
        {responses.attachment ? (
          <AttachmentsWrapper>
            <p>Reviewer has uploaded the following documents:</p>
            {responses.attachments.map(att => (
              <AttachmentItem
                data-testid="message-attachment"
                href={att.url}
                key={att.name}
                target="_blank"
              >
                <PaperClipOutlined />
                {att.name}
              </AttachmentItem>
            ))}
          </AttachmentsWrapper>
        ) : (
          <>
            {/* step 1 */}
            <Label>Did you answer the item correctly?</Label>
            <Answer>
              {renderAnswer(yesOrNoOptions, responses.answeredCorrectly)}
            </Answer>
            <Label>
              Were there any barriers or points of confusion for you in
              answering this item?
            </Label>
            <Answer>{responses.barriers || '-'}</Answer>
            <Label>
              In the context of your biology course, the content assessed by
              this item is:
            </Label>
            <Answer>
              {renderAnswer(difficultyOptions, responses.difficulty)}
            </Answer>
            {/* step 2 */}
            <Label>Evaluating content</Label>
            <Answer>
              {renderAnswer(hasIssuesOptions, responses.hasIssues)}
            </Answer>
            {responses.hasIssues ? (
              <>
                <Label>
                  You identified content-related issues; please explain in
                  greater detail:
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
                {responses.concerns?.includes('clarity') && (
                  <>
                    <Label>
                      If clarity-related issue(s) are noted, please explain in
                      detail.
                    </Label>
                    <Answer>{responses.clarityConcerns}</Answer>
                  </>
                )}
                {responses.concerns?.includes('grammatical') && (
                  <>
                    <Label>
                      If grammatical or structural issues are noted, please
                      explain in detail.
                    </Label>
                    <Answer>{responses.grammaticalConcerns}</Answer>
                  </>
                )}
                {responses.concerns?.includes('other') && (
                  <>
                    <Label>
                      If other item construction concerns are noted, please
                      explain in detail.
                    </Label>
                    <Answer>{responses.otherConcerns}</Answer>
                  </>
                )}
                <Label>
                  Do you have any additional suggestions for improving the item
                  as written?
                </Label>
                <Answer>{responses.suggestions || '-'}</Answer>
              </>
            )}
          </>
        )}
      </InputWraper>
    </>
  )
}

Step5.propTypes = {
  responses: PropTypes.shape(),
  reviewSubmitted: PropTypes.bool,
  numberOfResponses: PropTypes.number,
  setReviewerIndex: PropTypes.func,
}

Step5.defaultProps = {
  responses: null,
  reviewSubmitted: false,
  numberOfResponses: 1,
  setReviewerIndex: () => {},
}

export default Step5
