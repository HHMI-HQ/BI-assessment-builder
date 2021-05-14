import React from 'react'
import { lorem } from 'faker'

import { AuthenticationHeader } from 'ui'

export const Base = () => (
  <AuthenticationHeader>{lorem.words(3)}</AuthenticationHeader>
)

export default {
  component: AuthenticationHeader,
  title: 'Authentication/Authentication Header',
}
