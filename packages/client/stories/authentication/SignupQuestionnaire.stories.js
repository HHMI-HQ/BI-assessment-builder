/* eslint-disable no-console */

import React from 'react'
// import { lorem } from 'faker'

import { SignupQuestionnaire } from 'ui'

export const Base = () => (
  <SignupQuestionnaire
    onAutoSave={vals => console.log('saving', vals)}
    onSubmit={() => {}}
  />
)

export default {
  component: SignupQuestionnaire,
  title: 'Authentication/SignupQuestionnaire',
}
