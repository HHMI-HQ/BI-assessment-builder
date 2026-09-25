import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import ReportIssueButton from './ReportIssueButton'
import { Button } from '../common'

const Wrapper = styled.div`
  align-items: center;
  background-color: ${th('colorBackground')};
  border-top: 1px solid ${th('colorBorder')};
  display: flex;
  grid-column: ${({ withFeedback }) => (withFeedback ? '1 / 3' : '1 / 2')};
  margin: auto;
  padding: ${grid(2)} ${grid(2)};
  width: 100%;
`

const SubmitTest = styled.div`
  margin-inline-start: auto;
`

const SubmitTestBar = props => {
  const {
    withFeedback,
    showFeedBack,
    onSubmitReport,
    showDialog,
    resetTest,
    submitTest,
    isPublished,
  } = props

  return (
    <Wrapper withFeedback={withFeedback}>
      {isPublished && (
        <ReportIssueButton
          onSubmitReport={onSubmitReport}
          showDialog={showDialog}
        />
      )}
      <SubmitTest>
        {!withFeedback &&
          (showFeedBack ? (
            <Button onClick={resetTest} type="primary">
              Reset
            </Button>
          ) : (
            <Button onClick={submitTest} type="primary">
              Submit
            </Button>
          ))}
      </SubmitTest>
    </Wrapper>
  )
}

SubmitTestBar.propTypes = {
  withFeedback: PropTypes.bool,
  showFeedBack: PropTypes.bool,
  isPublished: PropTypes.bool,
  onSubmitReport: PropTypes.func,
  showDialog: PropTypes.func,
  resetTest: PropTypes.func,
  submitTest: PropTypes.func,
}

SubmitTestBar.defaultProps = {
  withFeedback: true,
  showFeedBack: false,
  isPublished: false,
  onSubmitReport: null,
  showDialog: null,
  resetTest: null,
  submitTest: null,
}

export default SubmitTestBar
