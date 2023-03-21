import React from 'react'
import MultipleQuestion from '../MultipleQuestion'
import { axe, render, renderer } from '../../../testUtils'

const addOption = jest.fn()
const removeOption = jest.fn()
const feedBackText = 'the feedback text'
const questionText = 'the question text'

const MockMultipleQuestion = props => (
  <MultipleQuestion
    addOption={addOption}
    feedBackText={feedBackText}
    questionNumber={3}
    questionText={questionText}
    removeOption={removeOption}
    showAddIcon
    showRemoveIcon
    {...props}
  />
)

describe('MultipleQuestion', () => {
  it('matches snapshot', () => {
    const multipleChoiceComponent = renderer
      .create(<MockMultipleQuestion />)
      .toJSON()

    expect(multipleChoiceComponent).toMatchSnapshot()
  })
  it('displays addOption, removeOption', () => {
    const { getByTestId } = render(<MockMultipleQuestion />)
    const addOptionBtn = getByTestId('add-option')
    const removeOptionBtn = getByTestId('remove-option')
    expect(addOptionBtn).toBeInTheDocument()
    expect(removeOptionBtn).toBeInTheDocument()
  })
  it('displays correct questionText and feedbackText', () => {
    const { getByText, getByPlaceholderText } = render(<MockMultipleQuestion />)
    const questionTxt = getByText(questionText)
    const feedbackTxt = getByPlaceholderText('Insert feedback')
    expect(questionTxt).toBeInTheDocument()
    expect(feedbackTxt.value).toBe(feedBackText)
  })
  // it('calls addOption and removeOption onClick', async () => {
  //   const newAddOption = jest.fn()
  //   const newRemoveOption = jest.fn()
  //   const { getByTestId } = render(
  //     <MockMultipleQuestion
  //       addOption={newAddOption}
  //       removeOption={newRemoveOption}
  //     />,
  //   )
  //   const addOptionBtn = getByTestId('add-option')
  //   const removeOptionBtn = getByTestId('remove-option')
  //   userEvent.click(addOptionBtn)
  //   await waitFor(() => expect(newAddOption).toHaveBeenCalled())
  //   userEvent.click(removeOptionBtn)
  //   await waitFor(() => expect(newRemoveOption).toHaveBeenCalled())
  // })
  it('disables Wax when readOnly props is passed', () => {
    const { container } = render(<MockMultipleQuestion readOnly />)
    const proseMirror = container.getElementsByClassName('ProseMirror')[0]
    expect(proseMirror).toHaveAttribute('contenteditable', 'false')
  })
  it('renders without any accessibility errors', async () => {
    const { container } = render(<MockMultipleQuestion />)
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
