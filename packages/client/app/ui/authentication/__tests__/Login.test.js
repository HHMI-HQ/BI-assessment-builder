import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import {
  render,
  renderer,
  screen,
  axe,
  fireEvent,
  waitFor,
} from '../../../testUtils'
import Login from '../Login'

const onSubmit = jest.fn()

const MockLogin = props => (
  <BrowserRouter>
    <Login onSubmit={() => {}} {...props} />
  </BrowserRouter>
)

describe('Login', () => {
  beforeEach(() => {
    const intersectionObserverMock = () => ({
      observe: () => null,
    })

    window.IntersectionObserver = jest
      .fn()
      .mockImplementation(intersectionObserverMock)
  })

  it('matches snapshot', () => {
    const loginComponent = renderer.create(<MockLogin />).toJSON()
    expect(loginComponent).toMatchSnapshot()
  })
  it('calls onSubmit once when submit button is clicked', async () => {
    render(<MockLogin onSubmit={onSubmit} />)
    onSubmit.mockClear()
    const email = screen.getByPlaceholderText('Please enter your email')
    const password = screen.getByPlaceholderText('Please enter your password')
    const submit = screen.getByRole('button')
    fireEvent.change(email, { target: { value: 'user@gmail.com' } })
    fireEvent.change(password, {
      target: { value: 'Password@123' },
    })

    fireEvent.click(submit)
    await waitFor(() => expect(onSubmit).toBeCalledTimes(1))
  })
  it('displays correct error message that is passed', () => {
    const errorMessage = "User doesn't exist"
    render(<MockLogin errorMessage={errorMessage} hasError />)
    const errText = screen.getByText(errorMessage)
    expect(errText.innerHTML).toBe(errorMessage)
  })
  it('displays spinner on loading', () => {
    render(<MockLogin loading />)
    const spinner = screen.getByRole('img', { name: 'loading' })
    expect(spinner).toBeTruthy()
  })
  it('renders with no accessibility error', async () => {
    const { container } = render(<MockLogin />)
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
