import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@coko/client'
import { QuestionList, Tabs } from '../common'

const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .ant-tabs {
    height: 100%;
    [role='tablist'] {
      background-color: ${th('colorSecondary')};
      margin: 0;
      padding: 0 10px;
      .ant-tabs-tab {
        padding: 12px 15px;
        text-transform: uppercase;
        font-weight: 700;
        margin: 0;
        &.ant-tabs-tab-active {
          background-color: ${th('colorBackground')};
          color: inherit;
        }
      }
      .ant-tabs-ink-bar {
        display: none;
      }
      [role='tab'] {
        &[aria-selected='true'] {
        }
      }
    }
    .ant-tabs-content-holder {
      .ant-tabs-content {
        height: 100%;
        max-width: 1170px;
        margin: auto;
        [role='tabpanel'] {
          display: flex;
          .dashboard-list {
            width: 100%;
          }
        }
      }
    }
  }
`

const sortOptions = [
  {
    label: 'Date',
    value: 'date',
    isDefault: true,
  },
  {
    label: 'Unit',
    value: 'unit',
  },
  {
    label: 'Section',
    value: 'section',
  },
  {
    label: 'Topic',
    value: 'topic',
  },
  {
    label: 'Category',
    value: 'category',
  },
]

const defaultTabs = [
  {
    label: 'Authored Questions',
    value: 'author',
  },
  {
    label: 'Editor Questions',
    value: 'editor',
  },
]

// QUESTION how to handle search, filter and pagination with multiple sections
const Dashboard = props => {
  const {
    className,
    loading,
    questions,
    totalCount,
    createQuestionButton,
    onQuestionSelected,
    onSearch,
    userRole,
    bulkAction,
  } = props

  const [searchParams, setSearchParams] = useState({
    query: '',
    page: 1,
    sortBy: 'date',
    tab: 'author',
  })

  const setSearchPage = page => {
    setSearchParams({ ...searchParams, page })
  }

  const setSearchQuery = query => {
    setSearchParams({ ...searchParams, query, page: 1 })
  }

  const setSortOption = sortBy => {
    setSearchParams({ ...searchParams, sortBy, page: 1 })
  }

  const setActiveTab = tab => {
    setSearchParams({ query: '', sortBy: 'date', page: 1, tab })
  }

  useEffect(() => {
    onSearch(searchParams)
  }, [searchParams])

  const tabs =
    userRole === 'editor'
      ? defaultTabs
      : defaultTabs.filter(tab => tab.value !== 'editor')

  return (
    <Wrapper className={className}>
      <Tabs
        className="dashboard"
        onChange={setActiveTab}
        tabBarExtraContent={createQuestionButton}
      >
        {tabs.map(({ value, label }) => (
          <Tabs.TabPane key={value} tab={label}>
            <QuestionList
              {...(value === 'editor' ? { bulkAction } : {})}
              className="dashboard-list"
              currentPage={searchParams.page}
              key={searchParams.tab}
              loading={loading}
              onPageChange={setSearchPage}
              onQuestionSelected={onQuestionSelected}
              onSearch={setSearchQuery}
              onSortOptionChange={setSortOption}
              questions={questions}
              showRowCheckboxes={value === 'editor'}
              sortOptions={sortOptions}
              totalCount={totalCount}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Wrapper>
  )
}

Dashboard.propTypes = {
  /** custom component for bulk actions */
  bulkAction: PropTypes.element,
  /** custom component for create question */
  createQuestionButton: PropTypes.shape(),
  /** Loading results. */
  loading: PropTypes.bool,
  /** hande]le selection and deselection of questions */
  onQuestionSelected: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      meta: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
      status: PropTypes.string,
    }),
  ),
  totalCount: PropTypes.number,
  userRole: PropTypes.string,
}

Dashboard.defaultProps = {
  bulkAction: <div />,
  createQuestionButton: () => null,
  loading: false,
  onQuestionSelected: () => {},
  questions: [],
  totalCount: 0,
  userRole: 'author',
}

export default Dashboard
