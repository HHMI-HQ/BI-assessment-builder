import React from 'react'

import { render, renderer, screen } from '../../../testUtils'

import TeamManagerBlock from '../TeamManagerBlock'

const members = [
  {
    id: '6e2655a0-9650-4add-89f6-d1f35c892afe',
    displayName: 'user1',
    checkboxLabel: 'Select user user1',
  },
  {
    id: '6e2655a0-9650-4add-89f6-d1f35c892afe',
    displayName: 'user2',
    checkboxLabel: 'Select user user2',
  },
  {
    id: '6e2655a0-9650-4add-89f6-d1f35c892afe',
    displayName: 'user3',
    checkboxLabel: 'Select user user3',
  },
  {
    id: '6e2655a0-9650-4add-89f6-d1f35c892afe',
    displayName: 'user4',
    checkboxLabel: 'Select user user4',
  },
]

const MockTeamManagerBlock = () => {
  return (
    <TeamManagerBlock
      displayName="editor"
      members={members}
      onAdd={jest.fn()}
      onRemove={jest.fn()}
      onRowSelectionChange={jest.fn()}
      onSearch={jest.fn()}
      teamId="teamId"
    />
  )
}

const createNodeMock = _ => {
  return {
    scrollWidth: 100,
    querySelector: () => ({
      removeAttribute: jest.fn(),
    }),
  }
}

describe('TeamManagerBlock', () => {
  it('matches snapshot', () => {
    const options = { createNodeMock }

    const teamManagerBlockComponent = renderer
      .create(<MockTeamManagerBlock />, options)
      .toJSON()

    expect(teamManagerBlockComponent).toMatchSnapshot()
  })
  it('renders correct number of members', () => {
    render(<MockTeamManagerBlock />)
    const list = screen.getAllByRole('listitem')
    expect(list.length).toBe(4)
  })
  it('renders all displayNames', () => {
    render(<MockTeamManagerBlock />)
    const listItems = screen.getAllByRole('listitem')
    listItems.forEach((item, i) => {
      expect(item.textContent).toBe(members[i].displayName)
    })
  })

  // Accessibility tests fails because of antd select

  /* eslint-disable-next-line jest/no-commented-out-tests */
  // it('Accessibility check', async () => {
  //   const { container } = render(
  //     <TeamManagerBlock
  //       displayName="editor"
  //       members={members}
  //       onAdd={jest.fn()}
  //       onRemove={jest.fn()}
  //       onRowSelectionChange={jest.fn()}
  //       onSearch={jest.fn()}
  //       teamId="teamId"
  //     />,
  //   )

  //   const results = await axe(container)
  //   expect(results).toHaveNoViolations()
  // })
})
