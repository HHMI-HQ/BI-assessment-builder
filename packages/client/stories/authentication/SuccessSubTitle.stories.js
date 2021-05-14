import React from 'react'
import { internet } from 'faker'

import { SuccessSubTitle } from 'ui'

export const Base = () => <SuccessSubTitle userEmail={internet.email()} />

export default {
  component: SuccessSubTitle,
  title: 'Authentication/Success Subtitle',
}
