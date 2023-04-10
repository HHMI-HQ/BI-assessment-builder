import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Input } from '../../common'
import { axe, render, renderer, userEvent, waitFor } from '../../../testUtils'
import AuthenticationForm from '../AuthenticationForm'

const Form = () => (
  <>
    <p>Test form</p>
    <Input placeholder="type your text here" />
  </>
)

const MockAuthenticationForm = props => {
  return (
    <BrowserRouter>
      <AuthenticationForm onSubmit={() => {}} {...props}>
        <Form />
      </AuthenticationForm>
    </BrowserRouter>
  )
}

const forgotPasswordUrl = '/test'
const alternativeActionLabel = 'do you want to click the alt link?'
const alternativeActionLink = '/alt-link'
const onSubmit = jest.fn()

describe('AuthenticationForm', () => {
  it('matches snapshot', () => {
    const AuthenticationFormComponent = renderer
      .create(
        <MockAuthenticationForm
          alternativeActionLabel={alternativeActionLabel}
          alternativeActionLink={alternativeActionLink}
          errorMessage="The error message"
          forgotPasswordUrl={forgotPasswordUrl}
          hasError
          onSubmit={onSubmit}
          submitButtonLabel="submit form"
        />,
      )
      .toJSON()

    expect(AuthenticationFormComponent).toMatchSnapshot()
  })

  it('displays error message', () => {
    const { getByText } = render(
      <MockAuthenticationForm errorMessage="The error message" hasError />,
    )

    const error = getByText('The error message')
    expect(error).toBeInTheDocument()
  })

  it('displays forgot password and alternative action', () => {
    const { getByText } = render(
      <MockAuthenticationForm
        alternativeActionLabel={alternativeActionLabel}
        alternativeActionLink={alternativeActionLink}
        forgotPasswordUrl={forgotPasswordUrl}
        showForgotPassword
      />,
    )

    const forgotPassword = getByText('Forgot your password?')
    const alternativeAction = getByText(alternativeActionLabel)

    expect(forgotPassword.href).toBe(`http://localhost${forgotPasswordUrl}`)
    expect(alternativeAction.href).toBe(
      `http://localhost${alternativeActionLink}`,
    )
  })

  it('displays submit button label and calls onSubmit', async () => {
    const { getByText } = render(
      <MockAuthenticationForm
        onSubmit={onSubmit}
        submitButtonLabel="submit form"
      />,
    )

    const submitBtn = getByText('submit form')
    expect(submitBtn).toBeInTheDocument()
    await userEvent.click(submitBtn)
    await waitFor(() => expect(onSubmit).toHaveBeenCalled())
  })

  it('displays spinner on loading', () => {
    const { getByRole } = render(<MockAuthenticationForm loading />)
    const spinner = getByRole('img')
    expect(spinner).toBeInTheDocument()
  })

  it('renders without accessibility error', async () => {
    const { container } = render(
      <MockAuthenticationForm
        alternativeActionLabel={alternativeActionLabel}
        alternativeActionLink={alternativeActionLink}
        errorMessage="The error message"
        forgotPasswordUrl={forgotPasswordUrl}
        hasError
        onSubmit={onSubmit}
        submitButtonLabel="submit form"
      />,
    )

    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
