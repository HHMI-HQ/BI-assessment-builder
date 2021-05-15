/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
// import { lorem } from 'faker'

import { ResetPassword } from 'ui'
import { Background } from '../_helpers'

const Template = args => (
  <Background>
    <ResetPassword {...args} />
  </Background>
)

export const Base = Template.bind({})
Base.args = {
  onSubmit: () => {},
}

export default {
  component: ResetPassword,
  title: 'Authentication/Reset Password',
}
