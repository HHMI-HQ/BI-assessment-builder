/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */

import React from 'react'

import { ProfileForm } from 'ui'
import { Filler } from '../../app/utilities/_helpers'

export const Base = args => {
  return (
    <ProfileForm {...args} onSubmit={values => console.log(values)}>
      <Filler />
    </ProfileForm>
  )
}

export const WithTwoButtons = () => {
  return (
    <ProfileForm onSubmit={values => console.log(values)} showSecondaryButton>
      <Filler />
    </ProfileForm>
  )
}

export const ErrorState = () => {
  return (
    <ProfileForm
      errorMessage="There was an error while submittin your form. Please check the feedback for each field"
      hasError
      onSubmit={values => console.log(values)}
    >
      <Filler />
    </ProfileForm>
  )
}

export const LoadingState = () => {
  return (
    <ProfileForm loading onSubmit={values => console.log(values)}>
      <Filler />
    </ProfileForm>
  )
}

export default {
  component: ProfileForm,
  title: 'Authentication/ProfileForm',
}
