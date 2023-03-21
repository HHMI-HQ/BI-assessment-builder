import React from 'react'
import { lorem } from 'faker'

import { FormSection } from 'ui'
import { Filler } from '../../app/utilities/_helpers'

export const Base = () => (
  <FormSection label={lorem.words(2)}>
    <Filler />
  </FormSection>
)

export default {
  component: FormSection,
  title: 'Common/FormSection',
}
