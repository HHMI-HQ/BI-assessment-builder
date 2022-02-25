import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@coko/client'
import { Button } from '../common'

const Wrapper = styled.nav`
  background-color: ${th('colorSecondary')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 5px;
  ul {
    display: flex;
    justify-content: start;
    align-items: stretch;
    margin-bottom: 0;
    padding: 0;
    height: 50px;
    li {
      list-style: none;

      padding: 0 15px;
      text-transform: uppercase;
      font-weight: 700;
      &.active {
        background-color: ${th('colorBackground')};
      }
      a {
        display: flex;
        align-items: center;
        height: 100%;
        color: inherit;
        text-decoration: none;
      }
    }
  }
`

const CreateQuestionsBtn = styled(Button)`
  text-transform: uppercase;
`

const navItems = [
  {
    title: 'Authored Questions',
    href: '/authored',
    roles: ['author', 'editor'],
  },
  { title: 'Editor Questions', href: '/editor', roles: ['editor'] },
]

const DashboardNav = props => {
  const { userRole, activePage, createQuestion } = props

  return (
    <Wrapper>
      <ul>
        {navItems
          .filter(item => item.roles.indexOf(userRole) !== -1)
          .map(item => {
            return (
              <li
                className={activePage === item.href ? 'active' : ''}
                key={item.href}
              >
                <a href={item.href}>{item.title}</a>
              </li>
            )
          })}
      </ul>
      <CreateQuestionsBtn onClick={createQuestion} type="primary">
        Create questions
      </CreateQuestionsBtn>
    </Wrapper>
  )
}

DashboardNav.propTypes = {
  userRole: PropTypes.string,
  activePage: PropTypes.string,
  createQuestion: PropTypes.func,
}

DashboardNav.defaultProps = {
  userRole: 'author',
  activePage: '/authored',
  createQuestion: () => {},
}

export default DashboardNav
