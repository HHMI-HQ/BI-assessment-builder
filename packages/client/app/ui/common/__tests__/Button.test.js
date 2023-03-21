import React from 'react'

import { renderer, render, screen } from '../../../testUtils'

import Button from '../Button'

describe('Button', () => {
  it('matches snapshot', () => {
    const buttonComponent = renderer.create(<Button />).toJSON()
    expect(buttonComponent).toMatchSnapshot()
  })
  it('renders text', () => {
    render(<Button>Simple button</Button>)
    const buttonElement = screen.getByRole('button')
    expect(buttonElement).toHaveTextContent('Simple button')
  })
  it('gets disabled', () => {
    render(<Button disabled />)
    const buttonElement = screen.getByRole('button')
    expect(buttonElement).toBeDisabled()
  })

  // Theme variable testing doesn't work for the time being
  /* eslint-disable-next-line jest/no-commented-out-tests */
  // it('has colorPrimary background color when primary', () => {
  //   render(<Button type="primary">Some text</Button>)
  //   const buttonElement = screen.getByTestId('button')
  //   // console.log('?', buttonElement.style.backgroundColor)
  //   // const { getComputedStyle } = buttonElement.ownerDocument.defaultView
  //   // console.log(getComputedStyle(buttonElement))
  //   expect(buttonElement).toHaveStyle({ backgroundColor: theme.colorPrimary })
  //   // expect(buttonElement).toHaveStyle({ backgroundColor: '#1677FF' })
  // })
})
