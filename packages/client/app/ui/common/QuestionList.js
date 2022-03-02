import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { th } from '@coko/client'
import { ConfigProvider } from 'antd'
import List from './List'
import LinkWithoutStyles from './LinkWithoutStyles'
import { DashboardRow } from '../dashboard'

const ButtonWithoutStyles = styled.button`
  border: none;
  background-color: transparent;
`

const Wrapper = styled.main`
  overflow: hidden;
  background-color: white;
  > div {
    height: 100%;
    display: flex;
    flex-direction: column;
    > .ant-spin-nested-loading {
      flex: 1 1 auto;
      overflow: auto;
      .ant-spin-container {
        height: 100%;
        .ant-list {
          display: flex;
          flex-direction: column;
          height: 100%;
          .ant-spin-nested-loading {
            flex-grow: 1;
            overflow: scroll;
            .ant-list-item {
              border-bottom: none;
              padding: 0 15px;
              .divider {
                border-bottom: 1px solid ${th('colorSecondary')};
                padding: 15px;
              }
            }
          }
          .ant-list-footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 50px;
            padding: 0 20px;
            display: flex;
            align-items: center;
            background-color: ${th('colorBackground')};
            border-top: 1px solid ${th('colorSecondary')};
            border-bottom: 1px solid ${th('colorSecondary')};
            > * {
              z-index: 3;
            }
          }
          .ant-list-pagination {
            flex-shrink: 0;
            margin-top: 0;
            color: ${th('colorText')};
            background-color: ${th('colorBackground')};
            border-top: 1px solid ${th('colorSecondary')};
            border-bottom: 1px solid ${th('colorSecondary')};
            display: flex;
            align-items: center;
            justify-content: right;
            height: 50px;
            z-index: 2;
          }
        }
      }
    }
  }
`

const EmptyList = () => {
  return 'no data'
}

const QuestionList = props => {
  const {
    bulkAction,
    currentPage,
    className,
    loading,
    questions,
    onSearch,
    onPageChange,
    showRowCheckboxes,
    onSortOptionChange,
    questionsPerPage,
    sortOptions,
    showSearch,
    showSort,
    showTotalCount,
    totalCount,
    onQuestionSelected,
    onClickRow,
  } = props

  const BulkAction = bulkAction

  const itemSelection = showRowCheckboxes
    ? {
        onChange: id => onQuestionSelected(id),
      }
    : null

  const shouldShowPagination =
    totalCount > questions.length || questions.length > questionsPerPage

  const pagination = () => {
    if (!shouldShowPagination) {
      return false
    }

    const paginationConfig = {}
    paginationConfig.pageSize = questionsPerPage

    if (totalCount > questions.length) {
      paginationConfig.onChange = onPageChange
    }

    paginationConfig.current = currentPage

    paginationConfig.itemRender = (_page, type, originalElement) => {
      if (type === 'prev') {
        return <ButtonWithoutStyles>Previous</ButtonWithoutStyles>
      }

      if (type === 'next') {
        return <ButtonWithoutStyles>Next</ButtonWithoutStyles>
      }

      return originalElement
    }

    return paginationConfig
  }

  const renderItem = item => (
    <List.Item>
      <LinkWithoutStyles href={item.href} onClick={() => onClickRow(item)}>
        <DashboardRow
          className="divider"
          content={item.description}
          metadata={item.metadata}
          status={item.status}
          title={item.title}
        />
      </LinkWithoutStyles>
    </List.Item>
  )

  return (
    <Wrapper className={className}>
      {questions && (
        <ConfigProvider renderEmpty={EmptyList}>
          <List
            dataSource={questions}
            footer={showRowCheckboxes && <BulkAction />}
            itemSelection={itemSelection}
            loading={loading}
            onSearch={onSearch}
            onSortOptionChange={onSortOptionChange}
            pagination={pagination()}
            renderItem={renderItem}
            showSearch={showSearch}
            showSort={showSort}
            showTotalCount={showTotalCount}
            sortOptions={sortOptions}
            totalCount={totalCount}
          />
        </ConfigProvider>
      )}
    </Wrapper>
  )
}

QuestionList.propTypes = {
  bulkAction: PropTypes.func,
  loading: PropTypes.bool,
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      metadata: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          value: PropTypes.string,
        }),
      ),
    }),
  ),
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  onSearch: PropTypes.func,
  onSortOptionChange: PropTypes.func,
  questionsPerPage: PropTypes.number,
  onQuestionSelected: PropTypes.func,
  onClickRow: PropTypes.func,
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  showRowCheckboxes: PropTypes.bool,
  showSearch: PropTypes.bool,
  showSort: PropTypes.bool,
  showTotalCount: PropTypes.bool,
  totalCount: PropTypes.number,
}

QuestionList.defaultProps = {
  bulkAction: () => {},
  loading: false,
  currentPage: 1,
  onPageChange: () => {},
  onSearch: () => {},
  onSortOptionChange: () => {},
  questions: [],
  questionsPerPage: 10,
  sortOptions: [],
  onQuestionSelected: () => {},
  onClickRow: () => {},
  showRowCheckboxes: false,
  showSearch: true,
  showSort: true,
  showTotalCount: true,
  totalCount: 0,
}

export default QuestionList
