import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { grid, th } from '@coko/client'
import { List, H1 } from '../common'
import TeamManagerBlock from './TeamManagerBlock'

const Wrapper = styled.div``

const StyledSection = styled.section`
  background: ${th('colorBackground')};
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: ${grid(4)};
`

const TeamManagerBlockWrapper = styled.div`
  padding: ${grid(8)} 0;
  width: 100%;
`

const TeamManagerListHeader = styled(H1)`
  text-align: center;
`

const StyledList = styled(List)`
  .ant-list-items {
    > li:not(:last-child) {
      border-bottom: 1px solid ${th('colorSecondary')};
    }
  }
`

const TeamManagerList = props => {
  const {
    className,
    loading,
    teams,
    onAdd,
    onRemove,
    onRowSelectionChange,
    onSearch,
    searchLoading,
    searchOptions,
  } = props

  return (
    <Wrapper className={className}>
      <StyledSection>
        <TeamManagerListHeader>Team Manager</TeamManagerListHeader>

        <StyledList
          className={className}
          dataSource={teams}
          // footerContent={bulkAction}
          loading={loading}
          onSearch={onSearch}
          renderItem={item => (
            <TeamManagerBlockWrapper>
              <TeamManagerBlock
                className={className}
                displayName={item.displayName}
                members={item.members}
                onAdd={onAdd}
                onRemove={onRemove}
                onRowSelectionChange={onRowSelectionChange}
                onSearch={onSearch}
                searchLoading={searchLoading}
                searchOptions={searchOptions}
                teamId={item.id}
              />
            </TeamManagerBlockWrapper>
          )}
          showPagination={false}
        />
      </StyledSection>
    </Wrapper>
  )
}

TeamManagerList.propTypes = {
  loading: PropTypes.bool,
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      role: PropTypes.string,
      displayName: PropTypes.string,
      members: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          displayName: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  onRowSelectionChange: PropTypes.func,
  onSearch: PropTypes.func,
  searchLoading: PropTypes.bool,
  searchOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
}

TeamManagerList.defaultProps = {
  loading: false,
  teams: [],
  onAdd: () => {},
  onRemove: () => {},
  onRowSelectionChange: () => {},
  onSearch: () => {},
  searchLoading: false,
  searchOptions: [],
}

export default TeamManagerList
