/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'
import styled from 'styled-components'
import { lorem } from 'faker'

import { AuthenticationForm } from 'ui'

const Body = styled.div`
  align-items: center;
  background: ${props => props.theme.colorSecondary};
  display: flex;
  height: 200px;
  justify-content: center;
  margin-bottom: 16px;
`

const Filler = () => (
  <Body>
    <span>The body of the form</span>
  </Body>
)

const Template = args => {
  return (
    <AuthenticationForm {...args}>
      <Filler />
    </AuthenticationForm>
  )
}

const commonArgs = {
  alternativeActionLabel: 'Do you want to do something else?',
  alternativeActionLink: '/',
  onSubmit: () => {},
  errorMessage: lorem.sentence(),
  hasError: false,
}

export const Base = Template.bind({})

Base.args = {
  ...commonArgs,
}

export const Loading = Template.bind({})

Loading.args = {
  ...commonArgs,
  loading: true,
}

export default {
  component: AuthenticationForm,
  title: 'Authentication/Authentication Form',
  parameters: { actions: { argTypesRegex: '^on.*' } },
}
