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
  grid-column: 1 / -1;
  justify-content: ${({ withFeedback }) =>
    withFeedback ? 'start' : 'space-between'};
  margin: auto;
  /* max-width: 100ch; */
  padding: ${grid(2)} ${grid(2)};
  width: 100%;
`

const SubmitTestBar = props => {
  const {
    withFeedback,
    showFeedBack,
    onSubmitReport,
    showDialog,
    resetTest,
    submitTest,
  } = props

  return (
    <Wrapper withFeedback={withFeedback}>
      <ReportIssueButton
        onSubmitReport={onSubmitReport}
        showDialog={showDialog}
      />
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
    </Wrapper>
  )
}

SubmitTestBar.propTypes = {
  withFeedback: PropTypes.bool,
  showFeedBack: PropTypes.bool,
  onSubmitReport: PropTypes.func,
  showDialog: PropTypes.func,
  resetTest: PropTypes.func,
  submitTest: PropTypes.func,
}

SubmitTestBar.defaultProps = {
  withFeedback: true,
  showFeedBack: false,
  onSubmitReport: null,
  showDialog: null,
  resetTest: null,
  submitTest: null,
}

export default SubmitTestBar
