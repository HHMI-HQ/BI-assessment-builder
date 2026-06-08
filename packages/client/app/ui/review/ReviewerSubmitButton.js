/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { Button, Form, Modal } from '../common'

const Label = styled.div`
  font-weight: bold;
  margin-block-start: ${grid(4)};
`

const Answer = styled.div`
  margin-block-start: ${grid(1)};
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

const difficultyOptions = [
  {
    label: 'Appropriate',
    value: 'appropriate',
  },
  {
    label: 'Too difficult',
    value: 'difficult',
  },
  {
    label: 'Too simple',
    value: 'simple',
  },
]

const hasIssuesOptions = [
  {
    label: 'There are NO content-related issues',
    value: false,
  },
  {
    label: 'There are content-related issues  ',
    value: true,
  },
]

const issuesOptions = [
  {
    label: 'There is a factual error in the stem',
    value: 'factualError',
  },
  {
    label: 'Sufficient detail to answer the item is lacking',
    value: 'insufficientDetail',
  },
  {
    label:
      'The content of this item does not incorporate the most up-to-date understanding in the field',
    value: 'outdated',
  },
  {
    label: 'There are other content-related issues',
    value: 'simple',
  },
]

const renderAnswer = (options, answer) => {
  return options.find(o => o.value === answer)?.label
}

const renderAnswersList = (options, answers) => {
  const labels = options
    .filter(o => answers.indexOf(o.value) >= 0)
    .map(a => <li key={a.label}>{a.label}</li>)

  return <ul>{labels}</ul>
}

const ModalHeader = Modal.header
const ModalFooter = Modal.footer
const ModalContext = React.createContext(null)

const ReviewerSubmitButton = props => {
  const { className, onSubmit, showDialog, responses } = props

  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [reviewForm] = Form.useForm()

  const footer = (
    <ModalFooter>
      <Button onClick={() => setShowModal(false)}>Cancel</Button>
      <Button autoFocus onClick={reviewForm.submit} type="primary">
        Submit Review
      </Button>
    </ModalFooter>
  )

  return (
    <ModalContext.Provider value={null}>
      <Button
        className={className}
        id="reviewerSubmitReview"
        loading={loading}
        onClick={() => setShowModal(true)}
        type="primary"
      >
        Submit Review
      </Button>
      <Modal
        afterClose={() =>
          document.getElementById('reviewerSubmitReview').focus()
        }
        destroyOnClose
        footer={footer}
        onCancel={() => setShowModal(false)}
        open={showModal}
        title={<ModalHeader>You are about to submit the review</ModalHeader>}
      >
        If you are comfortable with your responses, please submit this form.
        Alternatively, you can close this dialog and come back to the form at a
        later time.
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
          <p>steps 3 & 4</p>
        )}
      </Modal>
    </ModalContext.Provider>
  )
}

ReviewerSubmitButton.propTypes = {
  onSubmit: PropTypes.func,
  showDialog: PropTypes.func,
  responses: PropTypes.shape(),
}

ReviewerSubmitButton.defaultProps = {
  onSubmit: null,
  showDialog: null,
  responses: null,
}

export default ReviewerSubmitButton
