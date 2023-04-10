import React from 'react'
import List from '../List'
import { axe, render, renderer, userEvent, waitFor } from '../../../testUtils'

const data = [
  {
    id: '1',
    value:
      'Eaque laboriosam magnam perspiciatis delectus sunt et voluptatum et fugiat. Architecto molestias iure.',
  },
  {
    id: '2',
    value:
      'Autem eaque temporibus rerum vero consequuntur modi incidunt. Quis facere et saepe consequatur dignissimos ipsa adipisci eos.',
  },
  {
    id: '3',
    value:
      'Vel non aperiam nam quos perspiciatis temporibus. Nam ex quasi beatae cum est nesciunt.',
  },
  {
    id: '4',
    value:
      'Rem culpa nostrum quia non sed quod. Et est nesciunt aliquam non adipisci aut error qui.',
  },
  {
    id: '5',
    value: 'Possimus dicta earum. Placeat mollitia doloribus nisi.',
  },
  {
    id: '6',
    value: 'Quis eligendi porro aliquid. Sit perferendis eveniet.',
  },
  {
    id: '7',
    value:
      'Odio consequatur nihil facere illo animi. Est enim tempore doloremque.',
  },
  {
    id: '8',
    value:
      'Et sunt molestiae labore accusantium quo quia voluptate quis. Corrupti molestias quaerat ipsa vitae id sequi molestiae.',
  },
  {
    id: '9',
    value:
      'Fugiat et et officia. Reiciendis aut necessitatibus quia dolores iure officiis.',
  },
  {
    id: '10',
    value:
      'Voluptatem sit ipsa sapiente perspiciatis consectetur labore officiis. Sint autem alias voluptas eos et eaque.',
  },
]

const PAGE_SIZE = 5
const TOTAL_COUNT = 10

const sortOptions = [
  {
    label: 'Date (descending)',
    value: 'date-desc',
    isDefault: true,
  },
  {
    label: 'Date (ascending)',
    value: 'date-asc',
    isDefault: false,
  },
]

const MockList = props => {
  /* eslint-disable-next-line react/prop-types */
  const { searchPlaceholder } = props

  return (
    <List
      dataSource={data}
      loading={false}
      pagination={{
        current: 1,
        onChange: jest.fn(),
        pageSize: PAGE_SIZE,
        showSizeChanger: false,
        total: TOTAL_COUNT,
      }}
      renderItem={item => <div>{item.value}</div>}
      searchPlaceholder={searchPlaceholder || ''}
      sortOptions={sortOptions}
      {...props}
    />
  )
}

const createNodeMock = element => {
  return {
    querySelectorAll: () => [],
  }
}

describe('list', () => {
  it('matches snapshot', () => {
    const options = { createNodeMock }

    const listComponent = renderer.create(<MockList />, options).toJSON()

    expect(listComponent).toMatchSnapshot()
  })

  it('handles showSearch, showSort, showTotalCount, showPagination', () => {
    const { getByPlaceholderText, getByText, getByTestId, getByLabelText } =
      render(
        <MockList
          searchPlaceholder="test search..."
          showSearch
          showSort
          showTotalCount
          totalCount={TOTAL_COUNT}
        />,
      )

    const searchBox = getByPlaceholderText('test search...')
    const sortDropdown = getByTestId('sort-select')
    const totalCount = getByText(`${TOTAL_COUNT} results`)
    const pagination = getByLabelText('Pagination')

    expect(searchBox).toBeInTheDocument()
    expect(sortDropdown).toBeInTheDocument()
    expect(totalCount).toBeInTheDocument()
    expect(pagination).toBeInTheDocument()
  })

  it('renders correct footerContent', () => {
    const footerContent = (
      <button data-testid="footer-btn" type="button">
        Footer button
      </button>
    )

    const { getByTestId } = render(<MockList footerContent={footerContent} />)
    const footerBtn = getByTestId('footer-btn')
    expect(footerBtn).toBeInTheDocument()
  })

  it('renders spinner on loading', () => {
    const { container } = render(<MockList loading />)
    expect(container.getElementsByClassName('ant-spin ')).toBeTruthy()
  })

  it('calls onSearch', async () => {
    const onSearch = jest.fn()

    const { getByPlaceholderText } = render(
      <MockList
        onSearch={onSearch}
        searchPlaceholder="Test Search..."
        showSearch
      />,
    )

    const searchBox = getByPlaceholderText('Test Search...')

    await renderer.act(async () => {
      await userEvent.type(searchBox, 'src{enter}')
    })

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalled() // Check that the onClick function has been called
    })
  })

  it('renders without any accessibility error', async () => {
    const { container } = render(<MockList />)
    const result = await axe(container)
    expect(result).toHaveNoViolations()
  })
})
