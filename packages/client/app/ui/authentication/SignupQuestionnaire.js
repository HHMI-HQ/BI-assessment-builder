/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ProfileInfo from './ProfileInfo'
import AuthenticationHeader from './AuthenticationHeader'

const Wrapper = styled.div``

const SignupQuestionnaire = props => {
  const {
    form,
    headingText,
    initialValues,
    loading,
    message,
    onSubmit,
    secondaryButtonAction,
    submissionStatus,
  } = props

  return (
    <Wrapper>
      <AuthenticationHeader>{headingText}</AuthenticationHeader>
      <ProfileInfo
        form={form}
        initialValues={initialValues}
        loading={loading}
        message={message}
        onSubmit={onSubmit}
        secondaryButtonAction={secondaryButtonAction}
        secondaryButtonLabel="Clear"
        showSecondaryButton
        submissionStatus={submissionStatus}
        submitButtonLabel="Submit"
      />
    </Wrapper>
  )
}

SignupQuestionnaire.propTypes = {
  form: PropTypes.shape(),
  headingText: PropTypes.string,
  initialValues: PropTypes.shape(),
  loading: PropTypes.bool,
  message: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  secondaryButtonAction: PropTypes.func.isRequired,
  submissionStatus: PropTypes.string,
}

SignupQuestionnaire.defaultProps = {
  form: null,
  headingText: 'Signup',
  initialValues: {},
  loading: false,
  message: '',
  submissionStatus: null,
}

export default SignupQuestionnaire
