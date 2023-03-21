import React from 'react'
import { lorem } from 'faker'

import { AuthenticationWrapper, Paragraph } from 'ui'
import { Background } from '../../app/utilities/_helpers'

export const Base = () => (
  <Background>
    <AuthenticationWrapper>
      <Paragraph>{lorem.sentences(10)}</Paragraph>
    </AuthenticationWrapper>
  </Background>
)

export default {
  component: AuthenticationWrapper,
  title: 'Authentication/Authentication Wrapper',
}
