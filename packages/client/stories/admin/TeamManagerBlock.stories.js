import React, { useState } from 'react'
import { datatype, name } from 'faker'
import { uniqBy } from 'lodash'

import { TeamManagerBlock } from 'ui'
import { createData } from '../_helpers'

const makeUsers = n =>
  createData(n, i => ({
    id: datatype.uuid(),
    displayName: name.findName(),
  }))

const makeOptions = n =>
  createData(n, i => ({
    label: name.findName(),
    value: datatype.uuid(),
  }))

export const Base = () => {
  const [members, setMembers] = useState(makeUsers(3))
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchOptions, setSearchOptions] = useState([])

  const handleAdd = opts => {
    const newMembers = opts.map(opt => ({
      id: opt.value,
      displayName: opt.label,
    }))

    setMembers(uniqBy([...members, ...newMembers], 'id'))
  }

  const handleRowSelectionChange = data => {
    /* eslint-disable-next-line no-console */
    console.log('row selection change', data)
  }

  const handleSearch = searchValue => {
    if (!searchValue) {
      setSearchOptions([])
    } else {
      setSearchLoading(true)

      setTimeout(() => {
        setSearchLoading(false)
        setSearchOptions(makeOptions(5))
      }, 1000)
    }
  }

  return (
    <TeamManagerBlock
      members={members}
      onAdd={handleAdd}
      onRowSelectionChange={handleRowSelectionChange}
      onSearch={handleSearch}
      searchLoading={searchLoading}
      searchOptions={searchOptions}
    />
  )
}

export const Empty = () => {
  const noop = () => {}

  return (
    <TeamManagerBlock
      onAdd={noop}
      onRowSelectionChange={noop}
      onSearch={noop}
    />
  )
}

export default {
  component: TeamManagerBlock,
  title: 'Admin/TeamManagerBlock',
}
