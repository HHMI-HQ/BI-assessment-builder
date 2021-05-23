import React, { useState } from 'react'
import { datatype, lorem, name } from 'faker'
import { range } from 'lodash'

import { Select } from 'ui'

const makeOptions = n =>
  range(n).map(i => {
    return {
      label: name.findName(),
      value: datatype.uuid(),
    }
  })

const options = makeOptions(10)

const groupedOptions = [
  {
    label: 'Winners',
    options: makeOptions(4),
  },
  {
    label: 'Losers',
    options: makeOptions(4),
  },
]

export const Base = () => {
  return <Select options={options} placeholder={lorem.words(4)} />
}

export const WithGroups = () => (
  <Select options={groupedOptions} placeholder={lorem.words(4)} />
)

export const Multi = () => {
  return (
    <Select mode="multiple" options={options} placeholder={lorem.words(4)} />
  )
}

export const Async = () => {
  const [loading, setLoading] = useState(false)
  const [optionsData, setOptionsData] = useState([])

  const handleSearch = searchValue => {
    setLoading(true)

    setTimeout(() => {
      setOptionsData(makeOptions(5))
      setLoading(false)
    }, 500)
  }

  return (
    <Select
      async
      loading={loading}
      mode="multiple"
      onSearch={handleSearch}
      options={optionsData}
      placeholder={lorem.words(4)}
      // showSearch
    />
  )
}

export default {
  component: Select,
  title: 'Common/Select',
}
