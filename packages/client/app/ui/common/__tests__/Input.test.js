import React from 'react'
import EyeFilled from '@ant-design/icons/EyeFilled'

import { axe, render, renderer } from '../../../testUtils'
import Input from '../Input'

const CustomButton = visible => {
  return (
    <button
      aria-checked={visible}
      aria-label="Eye filled"
      role="switch"
      type="button"
    >
      <EyeFilled />
    </button>
  )
}

describe('Input', () => {
  it('matches snapshot (default input)', () => {
    const inputComponent = renderer.create(<Input />).toJSON()
    expect(inputComponent).toMatchSnapshot()
  })
  it('matches snapshot (password type)', () => {
    const inputComponent = renderer.create(<Input type="password" />)
    expect(inputComponent).toMatchSnapshot()
  })
  it('renders custom password icon', () => {
    const { getByLabelText } = render(
      <Input passwordIconRender={CustomButton} role="switch" type="password" />,
    )

    const eyeButton = getByLabelText('Eye filled')
    expect(eyeButton).toBeInTheDocument()
  })
  it('renders without accessibility errors (default input)', async () => {
    const { container } = render(<Input aria-label="test input" />)
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
  it('renders without accessibility errors (password type)', async () => {
    const { container } = render(
      <Input aria-label="test input" type="password" />,
    )

    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
