import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'
import {
  FormHeading,
  InputWraper,
  ExplanatoryParagraph,
  yesOrNoOptions,
  difficultyOptions,
  hasIssuesOptions,
  issuesOptions,
  questionTypesOptions,
  distractorsOptions,
  feedbackEvaluationOptions,
  feedbackIssuesOptions,
  concernsOptions,
  concernsSpecificsOptions,
} from './reviewerFormUI'

const Label = styled.div`
  font-weight: bold;
  margin-block-start: ${grid(4)};
`

const Answer = styled.div`
  margin-block-start: ${grid(1)};
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
  const { responses } = props

  return (
    <>
      <FormHeading>Review your responses</FormHeading>
      <ExplanatoryParagraph>
        Below you can review your responses. If you are comfortable with them,
        please submit this form. Alternatively, you can close the form and come
        back at a later time.
      </ExplanatoryParagraph>

      <InputWraper>
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
        <Label>Evaluating content</Label>
        <Answer>{renderAnswer(hasIssuesOptions, responses.hasIssues)}</Answer>
        {responses.hasIssues ? (
          <>
            <Label>
              You identified content-related issues; please select all that
              apply:
            </Label>
            <Answer>
              {renderAnswersList(issuesOptions, responses.issuesIdentification)}
            </Answer>
            <Label>Please explain the issue(s) in greater detail:</Label>
            <Answer>{responses.issuesDetails}</Answer>
          </>
        ) : (
          <>
            <Label>
              Is the item aligned to the appropriate Learning Objective or
              Bioskills?
            </Label>
            <Answer>
              {renderAnswer(yesOrNoOptions, responses.curriculaAlignment)}
            </Answer>
            <Label>
              Do you think that the item targets the Bloom’s level as written?
            </Label>
            <Answer>
              {renderAnswer(yesOrNoOptions, responses.bloomLevel)}
            </Answer>
            <Label>
              Please provide feedback about the Learning Objective, Bioskills
              alignment, or Bloom&#39;s level.
            </Label>
            <Answer>{responses.alignmentFeedback || '-'}</Answer>
            <Label>What is the item type that you are reviewing?</Label>
            <Answer>
              {renderAnswer(questionTypesOptions, responses.questionType)}
            </Answer>
            {(responses.questionType === 'multipleChoiceSingleCorrect' ||
              responses.questionType === 'multipleChoice') && (
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
                  You identified feedback-related issues; please select all that
                  apply:
                </Label>
                <Answer>
                  {renderAnswersList(
                    feedbackIssuesOptions,
                    responses.feedbackIssues,
                  )}
                </Answer>

                {responses.feedbackIssues.indexOf('other') > -1 && (
                  <>
                    <Label>Specify other feedback-related issues:</Label>
                    <Answer>{responses.otherIssues}</Answer>
                  </>
                )}

                <Label>Please explain the issue(s) in greater detail:</Label>
                <Answer>{responses.feedbackIssuesDetails}</Answer>

                {/* step 4 */}
                <Label>The construction of this item has:</Label>
                <Answer>
                  {renderAnswer(concernsOptions, responses.concerns)}
                </Answer>
                {responses.concerns && (
                  <>
                    <Label>
                      Which clarity, grammatical, structural, or other item
                      construction concerns do you have? Select all that apply.
                    </Label>
                    <Answer>
                      {renderAnswersList(
                        concernsSpecificsOptions,
                        responses.concernsSpecifics,
                      )}
                    </Answer>
                    {responses.concernsSpecifics?.indexOf('other') > -1 && (
                      <>
                        <Label>
                          Specify other concerns about item construction:
                        </Label>
                        <Answer>{responses.otherConcerns}</Answer>
                      </>
                    )}
                    <Label>
                      Please explain the clarity-related issue(s) in greater
                      detail:
                    </Label>
                    <Answer>{responses.concernsDetails}</Answer>
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
}

Step5.defaultProps = {
  responses: null,
}

export default Step5
