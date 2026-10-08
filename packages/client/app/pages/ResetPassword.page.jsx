import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { useMutation } from '@apollo/client/react'

import { ResetPassword } from 'ui'
import { RESET_PASSWORD } from '../graphql'

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const { token } = useParams()

  const [resetPasswordMutation, { data, loading, error }] =
    useMutation(RESET_PASSWORD)

  const resetPassword = formData => {
    const { password } = formData

    const mutationVariables = {
      variables: {
        token,
        password,
      },
    }

    resetPasswordMutation(mutationVariables)
  }

  const redirectToLogin = () => {
    navigate('/login')
  }

  return (
    <ResetPassword
      hasError={!!error}
      hasSuccess={!!data}
      onSubmit={resetPassword}
      redirectToLogin={redirectToLogin}
      verifying={loading}
    />
  )
}

ResetPasswordPage.propTypes = {}

ResetPasswordPage.defaultProps = {}

export default ResetPasswordPage
