import React from 'react'
import PropTypes from 'prop-types'
// import styled from 'styled-components'

import AuthenticationForm from './AuthenticationForm'
import AuthenticationHeader from './AuthenticationHeader'
import AuthenticationWrapper from './AuthenticationWrapper'
import { Form, Input } from '../common'

const Login = props => {
  const { className, errorMessage, hasError, loading, onSubmit } = props

  return (
    <AuthenticationWrapper className={className}>
      <AuthenticationHeader>Login</AuthenticationHeader>

      <AuthenticationForm
        alternativeActionLabel="Do you want to signup?"
        alternativeActionLink="/signup"
        errorMessage={errorMessage}
        hasError={hasError}
        loading={loading}
        onSubmit={onSubmit}
        showForgotPassword
        submitButtonLabel="Log in"
        title="Login"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Email is required',
            },
            {
              type: 'email',
              message: 'This is not a valid email address',
            },
          ]}
        >
          <Input placeholder="Please enter your email" type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input placeholder="Please enter your password" type="password" />
        </Form.Item>
      </AuthenticationForm>
    </AuthenticationWrapper>
  )
}

Login.propTypes = {
  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
}

Login.defaultProps = {
  errorMessage: null,
  hasError: false,
  loading: false,
}

export default Login
