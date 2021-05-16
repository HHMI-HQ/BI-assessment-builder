import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Table as AntTable } from 'antd'

import Search from './Search'
import Spin from './Spin'

const Wrapper = styled.div``

const Table = props => {
  const {
    className,
    children,
    loading,
    showSearch,
    searchLoading,
    onSearch,
    searchPlaceholder,
    ...rest
  } = props

  return (
    <Wrapper className={className}>
      {showSearch && (
        <Search
          loading={searchLoading}
          onSearch={onSearch}
          placeholder={searchPlaceholder}
        />
      )}

      <Spin spinning={loading}>
        <AntTable {...rest}>{children}</AntTable>
      </Spin>
    </Wrapper>
  )
}

Table.propTypes = {
  loading: PropTypes.bool,
  showSearch: PropTypes.bool,
  searchLoading: PropTypes.bool,
  onSearch: PropTypes.func,
  searchPlaceholder: PropTypes.string,
}

Table.defaultProps = {
  loading: false,
  showSearch: false,
  searchLoading: false,
  onSearch: null,
  searchPlaceholder: null,
}

export default Table
