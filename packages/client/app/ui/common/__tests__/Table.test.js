import React from 'react'
import { render, screen, axe, renderer } from '../../../testUtils'
import Table from '../Table'

const cols = [
  {
    title: 'Name',
    dataIndex: 'displayName',
    key: 'displayName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Expertise',
    dataIndex: 'expertise',
    key: 'expertise',
  },
  {
    title: 'Reviewer',
    dataIndex: 'isReviewer',
    key: 'isReviewer',
  },
  {
    title: 'Sign up Date',
    dataIndex: 'signUpDate',
    key: 'signUpDate',
  },
]

const dataSource = [
  {
    key: '5cdba495-9dea-4e60-b95b-a55846a1eebe',
    displayName: 'editor',
    email: 'editor@gmail.com',
    expertise: [],
    isReviewer: false,
    signUpDate: '2023-01-16T08:17:27.926Z',
  },
  {
    key: 'e49ad17d-69bb-4ed2-850c-68506d1334b3',
    displayName: 'user',
    email: 'user@gmail.com',
    expertise: [],
    isReviewer: false,
    signUpDate: '2023-01-16T08:17:30.948Z',
  },
  {
    key: 'cdeb1520-084a-48ca-a0a9-e56303d5e8fd',
    displayName: 'alphavignesh98',
    email: 'reviewer@gmail.com',
    expertise: [],
    isReviewer: false,
    signUpDate: '2023-01-16T08:18:48.312Z',
  },
]

describe('Table', () => {
  it('matches snapshot', () => {
    const tableComponent = renderer
      .create(<Table columns={cols} dataSource={dataSource} />)
      .toJSON()

    expect(tableComponent).toMatchSnapshot()
  })
  it('renders correct columns', () => {
    render(<Table columns={cols} />)
    const columns = screen.queryAllByRole('columnheader')
    columns.forEach((col, i) => {
      expect(col.textContent).toBe(cols[i].title)
    })
  })
  it('renders no data when dataSource is empty', () => {
    render(<Table columns={cols} dataSource={[]} />)
    const elem = screen.queryByText('No data')
    expect(elem).toBeTruthy()
  })

  it('renders with no accessibility errors with no data', async () => {
    const { container } = render(<Table columns={cols} dataSource={[]} />)

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
  it('renders with no accessibility errors with data array', async () => {
    const { container } = render(
      <Table columns={cols} dataSource={dataSource} />,
    )

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
