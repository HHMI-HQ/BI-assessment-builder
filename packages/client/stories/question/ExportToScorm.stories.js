/* eslint-disable no-console */

import React from 'react'

import ExportToScormButton from '../../app/ui/question/ExportToScormButton'

export const Base = args => (
  <ExportToScormButton onExport={options => console.log(options)} {...args} />
)

export default {
  component: ExportToScormButton,
  title: 'Question/ExportToScormButton',
}
