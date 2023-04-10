import React from 'react'

import {
  axe,
  fireEvent,
  render,
  renderer,
  screen,
  waitFor,
} from '../../../testUtils'
import ChangePassword from '../ChangePassword'

const MockChangePassword = props => {
  return <ChangePassword onSubmit={() => {}} {...props} />
}

describe('ChangePassword', () => {
  it('Matches snapshot', () => {
    const ChangePasswordComponent = renderer
      .create(<MockChangePassword />)
      .toJSON()

    expect(ChangePasswordComponent).toMatchSnapshot()
  })

  it('displays spinner on loading', () => {
    render(<MockChangePassword loading />)
    const spinner = screen.getByRole('img', { name: 'loading' })
    expect(spinner).toBeInTheDocument()
  })

  it('submits without error', async () => {
    const onSubmit = jest.fn()

    const { getByTestId, getByText } = render(
      <MockChangePassword
        message="Password changed successfully"
        onSubmit={onSubmit}
        submissionStatus="success"
      />,
    )

    const currentPassword = getByTestId('currentPassword')
    const newPassword = getByTestId('newPassword')
    const newPasswordConfirmation = getByTestId('newPasswordConfirmation')
    const submitButton = getByTestId('profile-form-submit-button')

    await fireEvent.change(currentPassword, { target: { value: 'password' } })
    await fireEvent.change(newPassword, { target: { value: 'newpassword' } })
    await fireEvent.change(newPasswordConfirmation, {
      target: { value: 'newpassword' },
    })
    await fireEvent.click(submitButton)

    await waitFor(() => expect(onSubmit).toBeCalledTimes(1))
    await waitFor(() => getByText('Password changed successfully'))
    expect(getByText('Password changed successfully')).toBeInTheDocument()
  })

  it('shows error message', () => {
    const { getByText } = render(
      <MockChangePassword
        message="An error occurred"
        submissionStatus="error"
      />,
    )

    const errorText = getByText('An error occurred')
    expect(errorText).toBeInTheDocument()
  })

  it('renders without any accessibility errors', async () => {
    const { container } = render(<MockChangePassword />)
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
