/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from 'react'
import { internet, lorem } from 'faker'

import { Signup } from 'ui'
import { Background } from '../../app/utilities/_helpers'

export const Base = args => (
  <Background>
    <Signup {...args} />
  </Background>
)

Base.args = {
  onSubmit: () => {},
  errorMessage: lorem.sentence(),
  userEmail: internet.email(),
}

export const FailingSignup = () => {
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setHasError(false)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setHasError(true)
    }, 2000)
  }

  return (
    <Background>
      <Signup
        errorMessage="A user with this email already exists!"
        hasError={hasError}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </Background>
  )
}

export const SuccessfulSignup = () => {
  const [hasSuccess, setHasSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setHasSuccess(false)
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      setHasSuccess(true)
    }, 2000)
  }

  return (
    <Background>
      <Signup
        hasSuccess={hasSuccess}
        loading={loading}
        onSubmit={handleSubmit}
        userEmail={internet.email()}
      />
    </Background>
  )
}

export const SuccessScreen = () => {
  return (
    <Background>
      <Signup hasSuccess onSubmit={() => {}} userEmail={internet.email()} />
    </Background>
  )
}

export default {
  component: Signup,
  title: 'Authentication/Signup',
  parameters: { actions: { argTypesRegex: '^on.*' } },
}
