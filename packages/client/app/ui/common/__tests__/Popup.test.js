import React from 'react'
import { Input, Popup, Button } from '../index'
import { axe, fireEvent, render, renderer, screen } from '../../../testUtils'

const PopupChildren = () => (
  <>
    <Input placeholder="name" />
    <Input placeholder="description" />
  </>
)

const MockPopup = props => {
  return (
    <Popup toggle={<Button data-testid="toggle-btn">Toggle</Button>} {...props}>
      {PopupChildren}
    </Popup>
  )
}

describe('Popup', () => {
  it('matches snapshot', () => {
    const PopupComponent = renderer.create(<MockPopup id="popup-1" />).toJSON()
    expect(PopupComponent).toMatchSnapshot()
  })

  it('displays correct toggle button', () => {
    render(<MockPopup toggle={<Button>Show popup</Button>} />)
    const popupButton = screen.getByText('Show popup')
    expect(popupButton).toBeInTheDocument()
  })
  it('checking visibility of the popup', () => {
    render(<MockPopup data-testid="popup-1" />)
    const toggle = screen.getByTestId('toggle-btn')
    const popup = screen.getByTestId('popup-1')
    expect(popup).not.toBeVisible()
    fireEvent.click(toggle)
    expect(popup).toBeVisible()
    fireEvent.click(toggle)
    document.body.click()
    expect(popup).not.toBeVisible()
  })

  it('generates random id if id is not passed', () => {
    render(<MockPopup data-testid="popup-1" />)
    const popup = screen.getByTestId('popup-1')
    const id = popup.getAttribute('id')
    expect(id).toMatch(/^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$/)
  })
  it('checking position and alignment of the popup', () => {
    render(
      <MockPopup
        alignment="end"
        data-testid="popup-elem"
        position="block/end"
      />,
    )
    const popupElem = screen.getByTestId('popup-elem')

    const popupStyle = getComputedStyle(popupElem)
    expect(popupStyle.insetBlockEnd).toBe('100%')
    expect(popupStyle['inset-inline-start']).toBe('0')
  })
  it('renders without accessibility errors', async () => {
    const { container } = render(<MockPopup />)
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
