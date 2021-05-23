import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { grid } from '@coko/client'

import { Button as UIButton, List, Select } from '../common'

const Wrapper = styled.div``

const SearchWrapper = styled.div`
  display: flex;
  margin-bottom: ${grid(3)};
`

const Button = styled(UIButton)`
  margin-left: ${grid(3)};
`

const Member = styled.div`
  padding: ${grid(2)};
`

// QUESTION: reviewers should probably be handled differently given the length of the list
// QUESTION: should we also have a delete button on each row?
const TeamManagerBlock = props => {
  const {
    className,
    members,
    onAdd,
    onSearch,
    onRowSelectionChange,
    searchLoading,
    searchOptions,
  } = props

  const [selectData, setSelectData] = useState([])
  const [selectUserCount, setSelectUserCount] = useState(0)

  const handleRowSelectionChange = userIds => {
    onRowSelectionChange(userIds)
  }

  const handleSelectChange = (userIds, options) => {
    setSelectData(options)
    setSelectUserCount(options.length)
  }

  const handleAdd = () => {
    Promise.resolve(onAdd(selectData)).then(() => {
      setSelectData([])
      setSelectUserCount(0)
    })
  }

  return (
    <Wrapper className={className}>
      <SearchWrapper>
        <Select
          async
          // https://github.com/ant-design/ant-design/issues/19970#issuecomment-763139893
          labelInValue
          loading={searchLoading}
          mode="multiple"
          onChange={handleSelectChange}
          onSearch={onSearch}
          options={searchOptions}
          placeholder="Search for a user"
          value={selectData}
        />

        <Button
          disabled={selectUserCount === 0}
          onClick={handleAdd}
          type="primary"
        >
          Add User{selectUserCount > 1 && 's'}
        </Button>
      </SearchWrapper>

      <List
        dataSource={members}
        itemSelection={{
          onChange: handleRowSelectionChange,
        }}
        renderItem={member => <Member>{member.displayName}</Member>}
      />
    </Wrapper>
  )
}

TeamManagerBlock.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
  ),
  onAdd: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onRowSelectionChange: PropTypes.func.isRequired,
  searchLoading: PropTypes.bool,
  searchOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
}

TeamManagerBlock.defaultProps = {
  members: [],
  searchLoading: false,
  searchOptions: [],
}

export default TeamManagerBlock
