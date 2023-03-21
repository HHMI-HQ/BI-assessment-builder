import React from 'react'
import { fireEvent, render, renderer, axe } from '../../../testUtils'
import Pagination from '../Pagination'

const pagination = {
  total: 40,
  pageSize: 8,
  current: 1,
}

const onPageChange = jest.fn()

const onShowSizeChange = jest.fn()

const MockPagination = () => {
  return (
    <Pagination
      onChange={onPageChange}
      onShowSizeChange={onShowSizeChange}
      pagination={pagination}
    />
  )
}

const createNodeMock = _ => {
  return {
    querySelectorAll: () => [],
  }
}

describe('Pagination', () => {
  it('matches snapshot', () => {
    const options = { createNodeMock }

    const paginationCompoenent = renderer
      .create(<MockPagination />, options)
      .toJSON()

    expect(paginationCompoenent).toMatchSnapshot()
  })
  it('renders correct page numbers', () => {
    const { queryAllByRole } = render(<MockPagination />)
    const listItems = queryAllByRole('listitem')
    const pageNumbers = '12345'

    const concatedPageNumbers = listItems.reduce((acc, item) => {
      return item.className.includes('ant-pagination-item')
        ? acc + item.textContent
        : acc
    }, '')

    const nextButton = listItems.find(item =>
      item.className.includes('ant-pagination-next'),
    )

    const prevButton = listItems.find(item =>
      item.className.includes('ant-pagination-prev'),
    )

    expect(nextButton).toBeTruthy()
    expect(prevButton).toBeTruthy()
    expect(concatedPageNumbers).toBe(pageNumbers)
  })
  it('calls onChange', () => {
    const { getByTitle } = render(<MockPagination />)
    const pageFour = getByTitle('4')
    fireEvent.click(pageFour)
    expect(onPageChange).toBeCalled()
  })

  it('renders with no accessibility error', async () => {
    const { container } = render(<MockPagination />)
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
