/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import { internet } from 'faker'

import { RequestPasswordReset } from 'ui'
import { Background } from '../../app/utilities/_helpers'

const dummyArgs = {
  onSubmit: () => {},
}

const Template = args => (
  <Background>
    <RequestPasswordReset {...args} {...dummyArgs} />
  </Background>
)

export const Base = Template.bind({})

export const InitialState = Template.bind({})

export const LoadingState = Template.bind({})
LoadingState.args = {
  loading: true,
}

export const ErrorState = Template.bind({})
ErrorState.args = {
  hasError: true,
}

export const SuccessfulState = Template.bind({})
SuccessfulState.args = {
  hasSuccess: true,
  userEmail: internet.email(),
}

export default {
  component: RequestPasswordReset,
  title: 'Authentication/Request Password Reset',
}
