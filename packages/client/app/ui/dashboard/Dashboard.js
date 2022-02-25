import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid } from '@coko/client'
import { QuestionList } from '../common'
import DashboardNav from './DashboardNav'

const Wrapper = styled.div`
  height: 100%;
  > div.ant-collapse > div.ant-collapse-item > .ant-collapse-header {
    align-items: center;
    display: flex;
    padding-left: ${grid(4)};

    > .anticon.ant-collapse-arrow {
      padding: 0 ${grid(3)} 0 0;
      position: initial;
    }
  }
`

const ListWrapper = styled.div`
  max-width: 1170px;
  height: 1px; // needs an arbitrary height to fit its container
  flex-grow: 1; // stretches to the available space
  display: flex;
  margin: auto;
  width: 100%;
  .dashboard-list {
    width: 100%;
  }
`

// QUESTION how to handle search, filter and pagination with multiple sections
const Dashboard = props => {
  const {
    loading,
    questions,
    totalCount,
    onSearch,
    onSortOptionChange,
    userRole,
    activePage,
  } = props

  const bulkAction = ids => {
    // eslint-disable-next-line no-console
    console.log(`assign questions: ${ids}`)
  }

  return (
    <Wrapper>
      <DashboardNav activePage={activePage} userRole={userRole} />
      <ListWrapper>
        <QuestionList
          bulkAction={bulkAction}
          loading={loading}
          onSearch={onSearch}
          onSortOptionChange={onSortOptionChange}
          questions={questions}
          // questionSelection={userRole === 'editor'}
          questionSelection
          questionsPerPage={20}
          test={userRole === 'editor'}
          totalCount={totalCount}
        />
      </ListWrapper>
    </Wrapper>
  )
}

Dashboard.propTypes = {
  activePage: PropTypes.string,
  /** Loading results. */
  loading: PropTypes.bool,
  onSearch: PropTypes.func.isRequired,
  onSortOptionChange: PropTypes.func.isRequired,
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      meta: PropTypes.arrayOf(
        PropTypes.shape({
          unit: PropTypes.string,
          section: PropTypes.string,
          topic: PropTypes.string,
          category: PropTypes.string,
          published: PropTypes.string,
        }),
      ),
      status: PropTypes.string,
    }),
  ),
  totalCount: PropTypes.number,
  userRole: PropTypes.string,
}

Dashboard.defaultProps = {
  activePage: '/authored',
  loading: false,
  questions: [],
  totalCount: 0,
  userRole: 'author',
}

export default Dashboard
